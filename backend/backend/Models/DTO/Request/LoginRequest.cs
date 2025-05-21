using System;
using System.Collections.Generic;

namespace backend.Models.DTO.Request
{
    public partial class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
