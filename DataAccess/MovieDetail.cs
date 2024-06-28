using MySql.Data.MySqlClient;
using System.Data;

namespace MovieList.DataAccess
{
    public class MovieDetail
    {
        public int MovieID { get; set; }
        public string Title { get; set; }
        public string PosterPath {  get; set; }
        public IFormFile Poster {  get; set; }
        public string Description { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int Popularity {  get; set; }
        public int TrendingScore { get; set; }
        public string Trailer {  get; set; }

        public MovieDetail()
        {
            Title = string.Empty;
            PosterPath = string.Empty;
            Description = string.Empty;
            ReleaseDate = DateTime.MinValue;
            Popularity = 0;
            TrendingScore = 0;
            Trailer = string.Empty;

        }

        public MovieDetail(int movieID, string title, string posterPath, string description, DateTime? releaseDate, int popularity, int trendingScore, string trailer)
        {
            MovieID = movieID;
            Title = title;
            Description = description;
            PosterPath= posterPath;
            ReleaseDate = releaseDate;
            Popularity = popularity;
            TrendingScore = trendingScore;
            Trailer = trailer;
        }
    }

    public class MovieDetailProcess
    {
        public static string MyConnectionString = ("server=localhost; port=3306; database= movielist; user=root; password=admin;");

        public static void AddMovieData(string title, string posterPath, string description, DateTime? releaseDate, int popularity, int trendingScore, string trailer)
        {
            var conn = new MySqlConnection(MyConnectionString);

            var cmd = conn.CreateCommand();
            cmd.Parameters.AddWithValue("Title", title);
            cmd.Parameters.AddWithValue("Poster", posterPath);
            cmd.Parameters.AddWithValue("Description", description);
            cmd.Parameters.AddWithValue("ReleaseDate", releaseDate);
            cmd.Parameters.AddWithValue("Popularity", popularity);
            cmd.Parameters.AddWithValue("TrendingScore", trendingScore);
            cmd.Parameters.AddWithValue("Trailer", trailer);

            string queryString = string.Format("INSERT INTO movie_detail (Title, Poster, Description, ReleaseDate, Popularity, TrendingScore, Trailer) VALUES (@Title, @Poster, @Description, @ReleaseDate, @Popularity, @TrendingScore, @Trailer);");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                int record = cmd.ExecuteNonQuery();
                conn.Close();
                Console.WriteLine("{0} record/s inserted...", record);
                Console.WriteLine("Movies added successfully");
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

        public static List<MovieDetail> getAllData()
        {
            List<MovieDetail> datalist = new List<MovieDetail>();

            var conn = new MySqlConnection(MyConnectionString);
            var cmd = conn.CreateCommand();

            string queryString = String.Format("SELECT MovieID, Title, Poster, Description, ReleaseDate, Popularity, TrendingScore, Trailer FROM movie_detail");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                MySqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    int ID = (int)dr["MovieID"];
                    string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                    string PosterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                    string description = dr["Description"] == DBNull.Value ? "" : dr["Description"].ToString();
                    DateTime? releaseDate = dr["ReleaseDate"] == DBNull.Value ? (DateTime?)null : dr.GetDateTime("ReleaseDate");
                    int popularity = (int)dr["Popularity"];
                    int trendingScore = (int)dr["TrendingScore"];
                    string trailer = dr["Trailer"] == DBNull.Value ? "" : dr["Trailer"].ToString();

                    datalist.Add(new MovieDetail(ID, title, PosterPath, description, releaseDate, popularity, trendingScore, trailer));
                }
                conn.Close();
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

            return datalist;
        }

        public static List<MovieDetail> getAllMovies(string term = "")
        {
            List<MovieDetail> movieList = new List<MovieDetail>();

            var conn = new MySqlConnection(MyConnectionString);
            var cmd = conn.CreateCommand();

            string queryString = "SELECT * FROM movie_detail";

            if (!string.IsNullOrEmpty(term))
            {
                queryString += " WHERE Title LIKE @term";
                cmd.Parameters.AddWithValue("@term", "%" + term + "%");
            }

            queryString += " ORDER BY MovieID";

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                MySqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    int ID = (int)dr["MovieID"];
                    string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                    string PosterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                    string description = dr["Description"] == DBNull.Value ? "" : dr["Description"].ToString();
                    DateTime? releaseDate = dr["ReleaseDate"] == DBNull.Value ? (DateTime?)null : dr.GetDateTime("ReleaseDate");
                    int popularity = (int)dr["Popularity"];
                    int trendingScore = (int)dr["TrendingScore"];
                    string trailer = dr["Trailer"] == DBNull.Value ? "" : dr["Trailer"].ToString();

                    movieList.Add(new MovieDetail(ID, title, PosterPath, description, releaseDate, popularity, trendingScore, trailer));
                }
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

            return movieList;
        }

        public static List<MovieDetail> getDataByPopularity()
        {
            List<MovieDetail> datalist = new List<MovieDetail>();

            var conn = new MySqlConnection(MyConnectionString);
            var cmd = conn.CreateCommand();

            string queryString = String.Format("SELECT MovieID, Title, Poster, Popularity FROM movie_detail ORDER BY Popularity DESC");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                MySqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    int ID = (int)dr["MovieID"];
                    string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                    string PosterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                    int popularity = (int)dr["Popularity"];

                    datalist.Add(new MovieDetail(ID, title, PosterPath, null, null, popularity, 0, null));
                }
                conn.Close();
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

            return datalist;
        }

        public static List<MovieDetail> getDataByReleaseDate()
        {
            List<MovieDetail> datalist = new List<MovieDetail>();

            var conn = new MySqlConnection(MyConnectionString);
            var cmd = conn.CreateCommand();

            string queryString = String.Format("SELECT MovieID, Title, Poster, ReleaseDate FROM movie_detail ORDER BY ReleaseDate DESC");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                MySqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    int ID = (int)dr["MovieID"];
                    string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                    string PosterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                    DateTime? releaseDate = dr["ReleaseDate"] == DBNull.Value ? (DateTime?)null : dr.GetDateTime("ReleaseDate");

                    datalist.Add(new MovieDetail(ID, title, PosterPath, null, releaseDate, 0, 0, null));
                }
                conn.Close();
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

            return datalist;
        }

        public static List<MovieDetail> getDataByTrendingScore()
        {
            List<MovieDetail> datalist = new List<MovieDetail>();

            var conn = new MySqlConnection(MyConnectionString);
            var cmd = conn.CreateCommand();

            string queryString = String.Format("SELECT MovieID, Title, Poster, TrendingScore FROM movie_detail ORDER BY TrendingScore DESC");

            try
            {
                conn.Open();
                cmd.CommandText = queryString;
                MySqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    int ID = (int)dr["MovieID"];
                    string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                    string PosterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                    int trendingScore = (int)dr["TrendingScore"];

                    datalist.Add(new MovieDetail(ID, title, PosterPath, null, null, 0, trendingScore, null));
                }
                conn.Close();
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

            return datalist;
        }

        public static MovieDetail getImageById(int id)
        {
            MovieDetail data = null;

            using (var conn = new MySqlConnection(MyConnectionString))
            {
                var cmd = conn.CreateCommand();
                string queryString = "SELECT MovieID, Title, Poster FROM movie_detail WHERE MovieID = @MovieID;";
                cmd.CommandText = queryString;
                cmd.Parameters.AddWithValue("@MovieID", id);

                try
                {
                    conn.Open();
                    using (MySqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            int movieID = (int)dr["MovieID"];
                            string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                            string posterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                            data = new MovieDetail(movieID, title, posterPath,null, null, 0, 0, null);
                        }
                    }
                }
                catch (Exception exp)
                {
                    Console.WriteLine("Error: {0}", exp.Message);
                }
            }

            return data;
        }

        public static MovieDetail getDataById(int id)
        {
            MovieDetail data = null;

            using (var conn = new MySqlConnection(MyConnectionString))
            {
                var cmd = conn.CreateCommand();
                string queryString = "SELECT MovieID, Title, Poster, Description, Trailer FROM movie_detail WHERE MovieID = @MovieID;";
                cmd.CommandText = queryString;
                cmd.Parameters.AddWithValue("@MovieID", id);

                try
                {
                    conn.Open();
                    using (MySqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            int movieID = (int)dr["MovieID"];
                            string title = dr["Title"] == DBNull.Value ? "" : dr["Title"].ToString();
                            string posterPath = dr["Poster"] == DBNull.Value ? "" : dr["Poster"].ToString();
                            string description = dr["Description"] == DBNull.Value ? "" : dr["Description"].ToString();
                            string trailer = dr["Trailer"] == DBNull.Value ? "" : dr["Trailer"].ToString();

                            data = new MovieDetail(movieID, title, posterPath, description, null, 0, 0, trailer);
                        }
                    }
                }
                catch (Exception exp)
                {
                    Console.WriteLine("Error: {0}", exp.Message);
                }
            }

            return data;
        }
    }
}
