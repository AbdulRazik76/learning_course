import { useEffect } from "react";
import axios from "axios";

export default function StatsCard({ stats, setStats, dark,setRecentCourses }) {

    useEffect(() => {
        fetchCourseDetails();
        fetchUsersCount();
    }, [])
    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/course/get-course");
            setRecentCourses(response.data.getCourse)
            const courseCount = response.data.getCourse.length;
            setStats(prevStats => {
                const updatedStats = [...prevStats];
                updatedStats[0] = { ...updatedStats[0], value: courseCount };
                return updatedStats;
            });


        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchUsersCount = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/get-users')
            const usersCount = response.data.length;
            console.log("ss", usersCount);

            setStats(prevStats => {
                const updatedStats = [...prevStats];
                updatedStats[1] = { ...updatedStats[1], value: usersCount };

                return updatedStats;
            });

        }
        catch (error) {
            console.error("Error fetching courses:", error);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.length > 0 ?
                stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`rounded-lg shadow p-6 ${dark ? 'bg-gray-800' : 'bg-white'}`}
                    >
                        <h3 className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{stat.name}</h3>
                        <p className={`text-2xl font-bold mt-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                        <p className={`mt-1 text-sm ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                            {stat.change} from last month
                        </p>
                    </div>
                )) :

                <div>No Data</div>
            }
        </div>
    )
}