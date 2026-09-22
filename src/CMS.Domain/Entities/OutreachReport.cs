using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class OutreachReport : BaseAuditableEntity
{
    public string LocationName { get; set; } = string.Empty;
    public DateTime Date { get; set; }

    public int MenCount { get; set; }
    public int WomenCount { get; set; }
    public int ChildrenCount { get; set; }
    public int TotalAttendance => MenCount + WomenCount + ChildrenCount;

    public int NewConvertsCount { get; set; }
}
