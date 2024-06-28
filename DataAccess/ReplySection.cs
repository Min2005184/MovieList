using MySql.Data.MySqlClient;
using Mysqlx.Expr;
using System.Data;

namespace MovieList.DataAccess
{
    public class ReplySection
    {
        public int PosterID {  get; set; }
        public int MemberID {  get; set; }
        public string UserName {  get; set; }
        public string CommentText { get; set; }
        public int ParentCommentID { get; set; }

        public ReplySection() 
        {
            PosterID = 0;
            MemberID = 0;
            CommentText = string.Empty;
            ParentCommentID = 0;
        }
        public ReplySection(int posterId, int memberId, string username, int parentCommentId, string comment)
        {
            PosterID = posterId;
            MemberID = memberId;
            UserName = username;
            CommentText = comment;
            ParentCommentID = parentCommentId;
        }
    }

    public class ReplyProcess
    {
        public static void AddReply(int posterId, int memberId, string comment, int ParentCommentId)
        {
            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);
            var cmd = conn.CreateCommand();

            cmd.Parameters.AddWithValue("PosterID", posterId);
            cmd.Parameters.AddWithValue("MemberID", memberId);
            cmd.Parameters.AddWithValue("Text", comment);
            cmd.Parameters.AddWithValue("ParentCommentID", ParentCommentId);

            string queryString = "INSERT INTO replytable (PosterID, MemberID, Text, ParentCommentID) VALUES (@PosterID, @MemberID, @Text, @ParentCommentID);";

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                int record = cmd.ExecuteNonQuery();
                conn.Close();
                Console.WriteLine("{0} record/s inserted...", record);
                Console.WriteLine("Reply added successfully");
            }
            catch(Exception exp)
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

        public static List<ReplySection> getReplyById(int parentCommentId)
        {
            List<ReplySection> dataList = new List<ReplySection>();

            using (var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString))
            {
                var cmd = conn.CreateCommand();
                cmd.Parameters.AddWithValue("@CommentID", parentCommentId);

                string queryString = @"
                            SELECT c.CommentID, r.MemberID AS reply_member_id, rm.userName AS reply_user_name, r.Text AS reply_text
                            FROM comment c
                            LEFT JOIN replytable r ON c.CommentID = r.ParentCommentID
                            LEFT JOIN memberdata rm ON r.MemberID = rm.MemberID
                            WHERE c.CommentID = @CommentID";

                try
                {
                    conn.Open();
                    cmd.CommandText = queryString;

                    using (var data = cmd.ExecuteReader())
                    {
                        while (data.Read())
                        {
                            int replyMemberId = data["reply_member_id"] == DBNull.Value ? 0 : (int)data["reply_member_id"];
                            string replyUserName = data["reply_user_name"] == DBNull.Value ? " " : data["reply_user_name"].ToString();
                            string commentText = data["reply_text"] == DBNull.Value ? " " : data["reply_text"].ToString();

                            var comment = new ReplySection(0, replyMemberId, replyUserName, 0, commentText);
                            dataList.Add(comment);
                        }
                    }
                }
                catch (Exception exp)
                {
                    Console.WriteLine("Error, {0}", exp.Message);
                }
            }

            return dataList;
        }

    }

}
