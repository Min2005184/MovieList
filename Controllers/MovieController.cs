using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using MovieList.DataAccess;
using MySql.Data.MySqlClient;
using System.Data;


namespace MovieList.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieController : ControllerBase
    {
        [HttpPost("[action]")]
        public async Task<IActionResult> AddDetail([FromForm] MovieDetail movie)
        {
            string relativePath = string.Empty;

            try
            {
                // Check if an avatar file was uploaded
                if (movie.Poster != null && movie.Poster.Length > 0 && movie.Poster.Length < 2097152)
                {
                    string fileName = Guid.NewGuid().ToString() + ".jpg";
                    relativePath = Path.Combine(@"\Movie\MovieDetail\", fileName);

                    string fileDir = Directory.GetCurrentDirectory();
                    string saveFilePath = fileDir + relativePath;


                    // Ensure the directory exists
                    string directoryPath = Path.GetDirectoryName(saveFilePath);
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }


                    using (var stream = System.IO.File.Create(saveFilePath))
                    {
                        await movie.Poster.CopyToAsync(stream);
                    }
                }

                // Update member data in the database
                MovieDetailProcess.AddMovieData(movie.Title, relativePath, movie.Description, movie.ReleaseDate, movie.Popularity, movie.TrendingScore, movie.Trailer);

                return Ok("Movie Detail added successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }



        [HttpGet("[action]/{id}")]
        public MovieDetail GetDataById(int id)
        {
            return MovieDetailProcess.getDataById(id);
        }



        [HttpGet("[action]/{term}")]
        public List<MovieDetail> Search(string term)
        {
            return MovieDetailProcess.getAllMovies(term);
        }



        [HttpPost("[action]")]
        public string CreateMember(Member member)
        {
            MemberProcess.AddMember(member.UserName, member.Age, member.Email, member.Password);
            return "Member Create Successfully!";
        }



        [HttpGet("[action]/{id}")]
        public Member GetMemberById(int id)
        {
            return MemberProcess.getMemberById(id);
        }



        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateMemberData([FromForm] Member member)
        {
            string relativePath = string.Empty;

            try
            {
                // Check if an avatar file was uploaded
                if (member.Avatar != null && member.Avatar.Length > 0 && member.Avatar.Length < 2097152)
                {
                    string fileName = Guid.NewGuid().ToString() + ".jpg";
                    relativePath = Path.Combine(@"\Upload\Avatar\", fileName);

                    string fileDir = Directory.GetCurrentDirectory();
                    string saveFilePath = fileDir + relativePath;

                    
                    // Ensure the directory exists
                    string directoryPath = Path.GetDirectoryName(saveFilePath);
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }
                    

                    using (var stream = System.IO.File.Create(saveFilePath))
                    {
                        await member.Avatar.CopyToAsync(stream);
                    }
                }

                // Retain existing avatar path if no new avatar is uploaded
                if (string.IsNullOrEmpty(relativePath))
                {
                    Member existingData = MemberProcess.getMemberByEmail(member.Email);
                    relativePath = existingData.AvatarPath;
                }

                // Update member data in the database
                MemberProcess.UpdateData(member.UserName, member.Email, relativePath);

                return Ok("Member data updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }



        [HttpGet("[action]/{email}")]
        public Member GetEmail(string email)
        {
            return MemberProcess.getMemberByEmail(email);
        }



        [HttpGet("[action]")]
        public List<MovieDetail> GetAllPosters()
        {
            return MovieDetailProcess.getAllData();
        }



        [HttpGet("[action]/{id}")]
        public IActionResult GetPosterById(int id)
        {
            MovieDetail movieData = MovieDetailProcess.getImageById(id);

            if (movieData == null)
            {
                return NotFound(); // Handle case where posterData is not found
            }

            // Read poster image from file
            try
            {
                string fileDir = Directory.GetCurrentDirectory();
                string fullPath = fileDir + movieData.PosterPath;

                // Check if the file exists
                if (!System.IO.File.Exists(fullPath))
                {
                    // Return a 404 Not Found response if the file does not exist
                    return NotFound("Poster not found");
                }

                // Open the file for reading
                var image = System.IO.File.OpenRead(fullPath);

                // Return the file with the appropriate content type
                return File(image, "image/jpeg");
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                return StatusCode(500, $"Error retrieving poster image: {ex.Message}");
            }
        }



        [HttpGet("[action]/{email}")]
        public IActionResult GetAvatarByEmail(string email)
        {
            Member avatar = MemberProcess.getAvatarByEmail(email);

            if (avatar == null)
            {
                return NotFound(); // Handle case where posterData is not found
            }

            // Read poster image from file
            try
            {

                string fullPath = Directory.GetCurrentDirectory() + avatar.AvatarPath;

                var imageFileStream = System.IO.File.OpenRead(fullPath);
                return File(imageFileStream, "image/jpeg"); 
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                return StatusCode(500, $"Error retrieving poster image: {ex.Message}");
            }
        }



        [HttpGet("[action]")]
        public List<MovieDetail> GetDataByPopularity()
        {
            return MovieDetailProcess.getDataByPopularity();
        }



        [HttpGet("[action]")]
        public List<MovieDetail> GetDataByReleaseDate()
        {
            return MovieDetailProcess.getDataByReleaseDate();
        }



        [HttpGet("[action]")]
        public List<MovieDetail> GetDataByTrendingScore()
        {
            return MovieDetailProcess.getDataByTrendingScore();
        }



        [HttpPost("[action]")]
        public string CreateComment(CommentSection comment)
        {
            CommentProcess.AddComment(comment.MemberID, comment.PosterID, comment.Text);
            return "Comment Create Successfully!";
        }



        [HttpGet("[action]/{id}")]
        public List<CommentSection> GetCommentsById(int id)
        {
            return CommentProcess.getCommentsById(id);
        }



        [HttpDelete("[action]/{commentId}")]
        public string DeleteComment(int commentId)
        {
            CommentProcess.DeleteCommentsById(commentId);
            return "Comment Deleting Successfully";
        }




        [HttpPost("[action]")]
        public string CreateReply(ReplySection reply)
        {
            ReplyProcess.AddReply(reply.PosterID, reply.MemberID, reply.CommentText, reply.ParentCommentID);
            return "Comment Create Successfully!";
        }



        [HttpGet("[action]/{parentId}")]
        public List<ReplySection> GetReplyById(int parentId)
        {
            return ReplyProcess.getReplyById(parentId);
        }

        [HttpPost("[action]")]
        public string UpdatePassword(Member member)
        {
            MemberProcess.updatePassword(member.Email, member.Password);
            return "Password update Successfully!";
        }
    }

}
