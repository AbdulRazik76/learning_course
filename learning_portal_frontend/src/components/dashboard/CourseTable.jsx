

export default function CourseTableComponent ({recentCourses,dark}){

    console.log("rece",recentCourses);
    
    
return(
    <div className={`rounded-lg shadow p-6 mb-8 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>Recent Courses</h2>
          <button className={`text-sm font-medium ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Course</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Price</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {recentCourses.sort().map((course) => (
                <tr key={course.id}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{course.name}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{course.category.category_name}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{course.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${course.status 
                        ? (dark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') 
                        : (dark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')}`}>
                      {course.status ? "active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
)

       
}