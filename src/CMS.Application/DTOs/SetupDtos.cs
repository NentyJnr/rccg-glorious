namespace CMS.Application.DTOs;

public class SaveServiceTypeDto
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SaveOfferingCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SaveDepartmentDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string HeadOfDepartment { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MeetingSchedule { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string LeadershipCouncilJson { get; set; } = "[]";
}

