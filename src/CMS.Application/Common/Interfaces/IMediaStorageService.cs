namespace CMS.Application.Common.Interfaces;

public class MediaUploadResult
{
    public bool Success { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
}

public interface IMediaStorageService
{
    Task<MediaUploadResult> UploadFileAsync(Stream fileStream, string originalFileName, string contentType, string folderPath, CancellationToken ct = default);
    Task<bool> DeleteFileAsync(string fileUrl, CancellationToken ct = default);
}
