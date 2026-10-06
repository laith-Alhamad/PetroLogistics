using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace PetroLogistics.API.Exceptions
{
    public class GlobalExceptionHandler:IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,Exception exception,CancellationToken cancellationToken)

        {
            var problemDetails = new ProblemDetails
            {
                Instance=httpContext.Request.Path
            };

            switch(exception)
            {

                case NotFoundException:
                    problemDetails.Status=StatusCodes.Status404NotFound;
                    problemDetails.Title="Not Found";
                    problemDetails.Detail=exception.Message;
                    break;

                case BadRequestException:
                    problemDetails.Status=StatusCodes.Status400BadRequest;
                    problemDetails.Title="Bad Request";
                    problemDetails.Detail=exception.Message;
                    break;

                case ConflictException:
                    problemDetails.Status=StatusCodes.Status409Conflict;
                    problemDetails.Title="Conflict";
                    problemDetails.Detail=exception.Message;
                    break;

                default:
                    problemDetails.Status=
                        StatusCodes.Status500InternalServerError;

                    problemDetails.Title=
                        "Internal Server Error";

                    problemDetails.Detail=
                        "An unexpected error occurred.";
                    break;
            }

            httpContext.Response.StatusCode=problemDetails.Status.Value;

            await httpContext.Response.WriteAsJsonAsync(problemDetails,cancellationToken);

            return true;
        }


    }
}
