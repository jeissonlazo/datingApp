using System;
using API.Entities;

namespace API.Interfaces;

public interface IMemberRepository
{
    Task<bool> SaveAllAsync();
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
    void Update(Member member);
    Task<Member?> GetMemberForUpdate(string memberId);
}
