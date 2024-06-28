using MySql.Data.MySqlClient;
using MovieList.DataAccess;
using System.Data;
using System.Diagnostics.Metrics;
using System.Text.Json;

namespace MovieList.DataAccess
{
    public class Member
    {
        public int MemberID { get; set; }
        public string UserName { get; set; }
        public string Age { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string AvatarPath { get; set; }
        public IFormFile? Avatar { get; set; }

        public Member()
        {
            UserName = string.Empty;
            Age = string.Empty;
            Email = string.Empty;
            Password = string.Empty;
            AvatarPath = string.Empty;
        }

        public Member(string userName, string age, string email, string password, int memberID = 0)
        {
            UserName = userName;
            Age = age;
            Email = email;
            Password = password;
            MemberID = memberID;
        }
    }

    public class MemberProcess
    {
        public static void AddMember(string userName, string age, string email, string password)
        {
            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("UserName", userName);
            cmd.Parameters.AddWithValue("Age", age);
            cmd.Parameters.AddWithValue("Email", email);
            cmd.Parameters.AddWithValue("Password", password);

            string queryString = string.Format("INSERT INTO memberdata (UserName, Age, Email, Password) VALUES (@UserName, @Age, @Email, @Password);");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                int record = cmd.ExecuteNonQuery();
                conn.Close();
                Console.WriteLine("{0} record/s inserted...", record);
                Console.WriteLine("Books added successfully");
            }
            catch (Exception exp)
            {
                Console.WriteLine("Error: {0}", exp.Message);
            }
            finally
            {
                if (conn.State == System.Data.ConnectionState.Open)
                    conn.Close();
            }
        }

        public static Member getMemberByEmail(string email)
        {
            Member memberList = null;

            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("Email", email);

            string queryString = String.Format("SELECT * from memberdata WHERE Email=@Email");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;

                MySqlDataReader data = cmd.ExecuteReader();

                while (data.Read())
                {
                    string username = data["UserName"] == DBNull.Value ? " " : data["UserName"].ToString();
                    string age = data["Age"] == DBNull.Value ? " " : data["Age"].ToString();
                    email = data["Email"] == DBNull.Value ? " " : data["Email"].ToString();
                    string password = data["Password"] == DBNull.Value ? " " : data["Password"].ToString();
                    int id = (int)data["MemberID"];
                    string? AvatarPath = data["Avatar"] == DBNull.Value ? "" : data["Avatar"].ToString();

                    memberList = new Member(username, age, email, password, id);
                    memberList.AvatarPath = AvatarPath;
                }

            }
            catch (Exception exp)
            {
                Console.WriteLine("Error , {0}", exp.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }

            return memberList;
        }

        public static Member getAvatarByEmail(string email)
        {
            Member memberList = null;

            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("Email", email);

            string queryString = String.Format("SELECT * from memberdata WHERE Email=@Email");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;

                MySqlDataReader data = cmd.ExecuteReader();

                while (data.Read())
                {
                    string username = data["UserName"] == DBNull.Value ? " " : data["UserName"].ToString();
                    string? AvatarPath = data["Avatar"] == DBNull.Value ? "" : data["Avatar"].ToString();

                    memberList = new Member(username, null, email, null);
                    memberList.AvatarPath = AvatarPath;
                }

            }
            catch (Exception exp)
            {
                Console.WriteLine("Error , {0}", exp.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }

            return memberList;
        }

        public static Member getMemberById(int id)
        {
            Member memberList = null;

            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("MemberID", id);

            string queryString = String.Format("SELECT * from memberdata WHERE MemberID=@MemberID");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;

                MySqlDataReader data = cmd.ExecuteReader();

                while (data.Read())
                {
                    string username = data["UserName"] == DBNull.Value ? " " : data["UserName"].ToString();
                    string age = data["Age"] == DBNull.Value ? " " : data["Age"].ToString();
                    string email = data["Email"] == DBNull.Value ? " " : data["Email"].ToString();
                    string password = data["Password"] == DBNull.Value ? " " : data["Password"].ToString();

                    memberList = new Member(username, age, email, password);
                }

            }
            catch (Exception exp)
            {
                Console.WriteLine("Error , {0}", exp.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }

            return memberList;
        }

        public static void UpdateData(string username, string email, string avatarPath)
        {
            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();

            cmd.Parameters.AddWithValue("UserName", username);
            cmd.Parameters.AddWithValue("Email", email);
            cmd.Parameters.AddWithValue("Avatar", avatarPath);


            string queryString = "UPDATE memberdata SET UserName=@UserName, Email=@Email, Avatar=@Avatar WHERE Email=@Email";
            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                int record = cmd.ExecuteNonQuery();
                conn.Close();
                Console.WriteLine("{0} record(s) updated.", record);
            }
            catch (Exception exp)
            {
                Console.WriteLine("Error: {0}", exp.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
        }

        public static void updatePassword(string email, string newpassword)
        {
            var conn = new MySqlConnection(MovieDetailProcess.MyConnectionString);

            var cmd = conn.CreateCommand();

            cmd.Parameters.AddWithValue("Email", email);
            cmd.Parameters.AddWithValue("Password", newpassword);

            string queryString = "UPDATE memberdata SET Password=@Password WHERE Email=@Email";

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                int record = cmd.ExecuteNonQuery();
                conn.Close();
                Console.WriteLine("{0} record(s) updated.", record);
            }
            catch (Exception exp)
            {
                Console.WriteLine("Error: {0}", exp.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
        }
    }
}
