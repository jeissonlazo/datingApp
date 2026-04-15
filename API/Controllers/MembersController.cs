using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository, IPhotoServices photoServices) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
           return Ok(await memberRepository.GetMembersAsync());
        }

        [HttpGet("{id}")]//https://localhost:5001/api/members/{id}
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }

        [HttpGet("{id}/photos")]//https://localhost:5001/api/members/{id}/photos
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosByMemberId(string id)
        {
            return Ok(await memberRepository.GetPhotosByMemberIdAsync(id));
        }

        [HttpPut]//https://localhost:5001/api/members/{id}
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(memberId == null)
            {
                return BadRequest("User not found");
            }

            var member = await memberRepository.GetMemberForUpdate(memberId);

            if(member == null)
            {
                return BadRequest("Member not found");
            }

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memberRepository.Update(member);

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]//https://localhost:5001/api/members/add-photo
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null)
            {
                return BadRequest("Member not found");
            }

            var result = await photoServices.UploadPhotoAsync(file);
            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            if(member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if(await memberRepository.SaveAllAsync())
            {
                return photo;
            }

            return BadRequest("Problem adding photo");
        }
        [HttpPut("set-main-photo/{photoId}")]//https://localhost:5001/api/members/set-main-photo/{photoId}
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if(member == null)
            {
                return BadRequest("Member not found in token");
            }

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);
            if(member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("This is already your main photo");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if(await memberRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to set main photo");
        }
    }
}
