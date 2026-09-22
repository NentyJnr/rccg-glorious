namespace CMS.Domain.Entities;

public class ServiceReportOffering
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServiceReportId { get; set; }
    public ServiceReport ServiceReport { get; set; } = null!;

    public Guid OfferingCategoryId { get; set; }
    public OfferingCategory OfferingCategory { get; set; } = null!;

    public decimal Amount { get; set; }
}
