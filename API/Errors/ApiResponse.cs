using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message  ?? GetDefaultMesaageForStatusCode(StatusCode);
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }


        private string GetDefaultMesaageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "A bad request, you have made",
                401 => "Autorized, you are not",
                404 => "Resource found, it was not",
                500 => "Error are the path to the dark side. Errors lead to anger. Anger ledas to hate. Hate leads to career change.",
                _ => null
            };
        }
    }
}