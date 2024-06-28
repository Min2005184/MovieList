using MySql.Data.MySqlClient;
using System.Data;

namespace MovieList.DataAccess
{
    public class CommentSection
    {
        public int PosterID { get; set; }
        public int MemberID {  get; set; }
        public string UserName {  get; set; }
        public int CommentID { get; set; }

        public string Text{ get; set; }
        public DateTime? CreateAt { get; set; }

        public CommentSection() 
        {
            PosterID = 0;
            MemberID = 0;
            UserName = string.Empty;
            CommentID = 0;
            Text = string.Empty;
        }

        public CommentSection(int posterId, int memberId, string username, int commentID, string text, DateTime? createAt)
        {
            PosterID = posterId;
            MemberID = memberId;
            UserName = username;
            CommentID = commentID;
            Text = text;
            CreateAt = createAt;
        }
    }

    public class CommentProcess
    {
        public static void AddComment(int memberId, int posterId, string comment)
        {
            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);
            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("@PosterID", posterId);
            cmd.Parameters.AddWithValue("@MemberID", memberId);
            cmd.Parameters.AddWithValue("@Text", comment);

            // Correct query string with parameter placeholders
            string queryString = "INSERT INTO comment (MemberID, PosterID, Text) VALUES (@MemberID, @PosterID, @Text)";

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                int record = cmd.ExecuteNonQuery();
                conn.Close();
                Console.WriteLine("{0} record/s inserted...", record);
                Console.WriteLine("Comment added successfully");
            }
            catch (Exception exp)
            {
                Console.WriteLine("Error: {0}", exp.Message);
                Console.WriteLine("Stack Trace: {0}", exp.StackTrace);
            }
            finally
            {
                if (conn.State == System.Data.ConnectionState.Open)
                    conn.Close();
            }
        }


        public static List<CommentSection> getCommentsById(int id)
        {
            List<CommentSection> dataList = new List<CommentSection>();

            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("PosterID", id);

            string queryString = "\r\nSELECT memberdata.MemberID, memberdata.UserName, comment.CommentID, comment.Text, comment.CreateAt\r\nFROM comment\r\nJOIN memberdata ON comment.MemberID = memberdata.MemberID\r\nWHERE comment.PosterID = @PosterID\r\nORDER BY comment.CreateAt DESC;";

            try
            {
                conn.Open();
                cmd.CommandText = queryString;

                MySqlDataReader data = cmd.ExecuteReader();

                while (data.Read())
                {
                    int MemberID = (int)data["MemberID"];
                    string username = data["UserName"] == DBNull.Value ? " " : data["UserName"].ToString();
                    int commentID = (int)data["CommentID"];
                    string commentText = data["Text"] == DBNull.Value ? " " : data["Text"].ToString();
                    DateTime? createdAt = data["CreateAt"] == DBNull.Value ? (DateTime?)null : data.GetDateTime("CreateAt");

                    var comment = new CommentSection(0, MemberID, username, commentID, commentText, createdAt);
                    dataList.Add(comment);
                }
            }
            catch (Exception exp)
            {
                Console.WriteLine("Error, {0}", exp.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }

            return dataList;
        }

        public static void DeleteCommentsById(int commentId)
        {
            var connectionString = MovieDetailProcess.MyConnectionString;
            var queryString = "DELETE FROM comment WHERE CommentID=@CommentID;";

            using (var conn = new MySqlConnection(connectionString))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = queryString;
                    cmd.Parameters.AddWithValue("@CommentID", commentId);

                    try
                    {
                        conn.Open();
                        int recordsDeleted = cmd.ExecuteNonQuery();
                        Console.WriteLine("{0} record(s) deleted.", recordsDeleted);
                    }
                    catch (Exception exp)
                    {
                        // More structured error handling
                        Console.WriteLine("Error occurred: {0}", exp.Message);
                    }
                }
            } // The connection is automatically closed and disposed here, even if an exception occurs
        }
    }
}
