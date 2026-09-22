using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class ServiceReport : BaseAuditableEntity
{
    public Guid ServiceTypeId { get; set; }
    public ServiceType ServiceType { get; set; } = null!;
    public DateTime ServiceDate { get; set; }

    // Headcount
    public int MenCount { get; set; }
    public int WomenCount { get; set; }
    public int ChildrenCount { get; set; }
    public int TotalAttendance => MenCount + WomenCount + ChildrenCount;

    // Additional Metrics
    public int FirstTimersCount { get; set; }
    public int NewConvertsCount { get; set; }

    // Midweek Conditional Fields
    public Guid? PreacherMinisterId { get; set; }
    public Minister? PreacherMinister { get; set; }
    public decimal? SingleOfferingAmount { get; set; }

    // Sunday Conditional Fields
    public decimal? TotalSundayOffering { get; set; }

    // Navigation for embedded line-items breakdown (Sunday Service)
    public ICollection<ServiceReportOffering> OfferingBreakdown { get; set; } = new List<ServiceReportOffering>();
}
