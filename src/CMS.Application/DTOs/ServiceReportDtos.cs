namespace CMS.Application.DTOs;

public record OfferingBreakdownItemDto(
    Guid OfferingCategoryId,
    decimal Amount
);

public record CreateServiceReportCommand(
    Guid ServiceTypeId,
    DateTime ServiceDate,
    int MenCount,
    int WomenCount,
    int ChildrenCount,
    int FirstTimersCount,
    int NewConvertsCount,
    Guid? PreacherMinisterId,
    decimal? SingleOfferingAmount,
    List<OfferingBreakdownItemDto>? OfferingBreakdown,
    Guid CreatedByUserId
);

public record ServiceReportResultDto(
    Guid Id,
    string ServiceTypeName,
    string ServiceCategory,
    DateTime ServiceDate,
    int MenCount,
    int WomenCount,
    int ChildrenCount,
    int TotalAttendance,
    int FirstTimersCount,
    int NewConvertsCount,
    string? PreacherName,
    decimal TotalOffering
);
