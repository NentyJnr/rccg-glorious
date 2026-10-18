using CMS.Application.Common.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CMS.Infrastructure.Services;

public class LocalStorageService : IMediaStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LocalStorageService> _logger;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"
    };

    public LocalStorageService(
        IWebHostEnvironment environment,
        IConfiguration configuration,
        ILogger<LocalStorageService> logger)
    {
        _environment = environment;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<MediaUploadResult> UploadFileAsync(
        Stream fileStream,
        string originalFileName,
        string contentType,
        string folderPath,
        CancellationToken ct = default)
    {
        try
        {
            var extension = Path.GetExtension(originalFileName);
            if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            {
                return new MediaUploadResult
                {
                    Success = false,
                    ErrorMessage = $"File format '{extension}' is not supported. Allowed formats: {string.Join(", ", AllowedExtensions)}"
                };
            }

            // Determine root path for uploads (wwwroot/uploads)
            var webRoot = _environment.WebRootPath;
            if (string.IsNullOrWhiteSpace(webRoot))
            {
                webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
            }

            // Sanitize folder path
            var cleanFolderPath = folderPath.Replace("..", "").Trim('/', '\\');
            var targetDirectory = Path.Combine(webRoot, "uploads", cleanFolderPath);

            if (!Directory.Exists(targetDirectory))
            {
                Directory.CreateDirectory(targetDirectory);
            }

            // Generate cryptographically unique GUID filename
            var uniqueFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
            var destinationFilePath = Path.Combine(targetDirectory, uniqueFileName);

            using (var destinationStream = new FileStream(destinationFilePath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, true))
            {
                await fileStream.CopyToAsync(destinationStream, ct);
            }

            var fileInfo = new FileInfo(destinationFilePath);
            var relativeUrl = $"/uploads/{cleanFolderPath.Replace('\\', '/')}/{uniqueFileName}";

            _logger.LogInformation("Saved media file to {Path} as {RelativeUrl}", destinationFilePath, relativeUrl);

            return new MediaUploadResult
            {
                Success = true,
                Url = relativeUrl,
                ThumbnailUrl = relativeUrl,
                FileSizeBytes = fileInfo.Length,
                ContentType = contentType
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload file '{FileName}' to '{Folder}'", originalFileName, folderPath);
            return new MediaUploadResult
            {
                Success = false,
                ErrorMessage = $"Upload failed: {ex.Message}"
            };
        }
    }

    public Task<bool> DeleteFileAsync(string fileUrl, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(fileUrl)) return Task.FromResult(false);

            // If it's a relative url starting with /uploads/
            if (fileUrl.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            {
                var webRoot = _environment.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRoot))
                {
                    webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
                }

                var relativeSubPath = fileUrl.TrimStart('/');
                var physicalPath = Path.Combine(webRoot, relativeSubPath.Replace('/', Path.DirectorySeparatorChar));

                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                    _logger.LogInformation("Deleted physical media file at {Path}", physicalPath);
                    return Task.FromResult(true);
                }
            }

            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Could not delete media file at {Url}", fileUrl);
            return Task.FromResult(false);
        }
    }
}
