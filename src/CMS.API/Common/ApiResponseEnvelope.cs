namespace CMS.API.Common;

public class ApiResponseEnvelope<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResponseEnvelope<T> Ok(T data, string message = "Success")
    {
        return new ApiResponseEnvelope<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponseEnvelope<T> Fail(string message, List<string>? errors = null)
    {
        return new ApiResponseEnvelope<T>
        {
            Success = false,
            Message = message,
            Data = default,
            Errors = errors ?? new List<string>()
        };
    }
}
