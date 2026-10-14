using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface IMemberService
{
    Task<List<MemberListItemDto>> GetMembersAsync(string? departmentName, CancellationToken ct = default);
    Task<MemberListItemDto> RegisterMemberAsync(RegisterMemberRequestDto request, CancellationToken ct = default);
}
