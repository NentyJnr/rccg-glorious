using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class HouseFellowshipReport : BaseAuditableEntity
{
    public string CenterName { get; set; } = string.Empty;
    public DateTime MeetingDate { get; set; }
    public string LeaderName { get; set; } = string.Empty;

    public int MenCount { get; set; }
    public int WomenCount { get; set; }
    public int ChildrenCount { get; set; }
    public int TotalAttendance => MenCount + WomenCount + ChildrenCount;

    public int NewConvertsCount { get; set; }
    public decimal OfferingAmount { get; set; }
    public string StudyTopic { get; set; } = string.Empty;
}
