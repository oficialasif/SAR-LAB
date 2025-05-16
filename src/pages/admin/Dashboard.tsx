import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import { FaUsers, FaProjectDiagram, FaFlask } from 'react-icons/fa';

interface DashboardStats {
  teamMembers: number;
  projects: number;
  research: number;
  projectStatus: Record<string, number>;
  researchStatus: Record<string, number>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    teamMembers: 0,
    projects: 0,
    research: 0,
    projectStatus: {},
    researchStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch team members count
        const teamSnapshot = await getDocs(collection(db!, 'team-members'));
        const teamCount = teamSnapshot.size;

        // Fetch projects count and status
        const projectsSnapshot = await getDocs(collection(db!, 'projects'));
        const projectCount = projectsSnapshot.size;
        const projectStatus: Record<string, number> = {};
        projectsSnapshot.forEach(doc => {
          const status = doc.data().status;
          projectStatus[status] = (projectStatus[status] || 0) + 1;
        });

        // Fetch research count and status
        const researchSnapshot = await getDocs(collection(db!, 'research'));
        const researchCount = researchSnapshot.size;
        const researchStatus: Record<string, number> = {};
        researchSnapshot.forEach(doc => {
          const status = doc.data().status;
          researchStatus[status] = (researchStatus[status] || 0) + 1;
        });

        setStats({
          teamMembers: teamCount,
          projects: projectCount,
          research: researchCount,
          projectStatus,
          researchStatus
        });

        // Fetch recent activities
        const activitiesQuery = query(
          collection(db!, 'activities'),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        setActivities(
          activitiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Team Members',
      count: stats.teamMembers,
      icon: <FaUsers className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-50',
      link: '/admin/team'
    },
    {
      title: 'Projects',
      count: stats.projects,
      icon: <FaProjectDiagram className="w-8 h-8 text-green-500" />,
      bgColor: 'bg-green-50',
      link: '/admin/projects'
    },
    {
      title: 'Research',
      count: stats.research,
      icon: <FaFlask className="w-8 h-8 text-purple-500" />,
      bgColor: 'bg-purple-50',
      link: '/admin/research'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`${card.bgColor} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
              </div>
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Project Status Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Status</h2>
        <div className="space-y-4">
          {Object.entries(stats.projectStatus).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <div className="w-32 text-sm text-gray-600 capitalize">
                {status.replace('-', ' ')}
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(count / stats.projects) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="w-12 text-right text-sm text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {activity.type === 'team' && <FaUsers className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'project' && <FaProjectDiagram className="h-5 w-5 text-green-500" />}
                    {activity.type === 'research' && <FaFlask className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user} {activity.action} {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.timestamp.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 