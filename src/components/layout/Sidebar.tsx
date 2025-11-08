import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  CheckCircle as AttendanceIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const DRAWER_WIDTH = 240;

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  roles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: ROUTES.DASHBOARD,
  },
  {
    title: 'Students',
    icon: <PeopleIcon />,
    path: ROUTES.STUDENTS,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    title: 'Teachers',
    icon: <SchoolIcon />,
    path: ROUTES.TEACHERS,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Classes',
    icon: <ClassIcon />,
    path: ROUTES.CLASSES,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Attendance',
    icon: <AttendanceIcon />,
    path: ROUTES.ATTENDANCE,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    title: 'Timetable',
    icon: <ScheduleIcon />,
    path: ROUTES.TIMETABLE,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    title: 'Fees',
    icon: <PaymentIcon />,
    path: ROUTES.FEES,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Reports',
    icon: <ReportsIcon />,
    path: ROUTES.REPORTS,
    roles: [UserRole.ADMIN],
  },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hasAnyRole, user } = useAuth();

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return hasAnyRole(item.roles);
  });

  const drawerContent = (
    <>
      <Toolbar>
        <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>School ERP</Box>
      </Toolbar>
      
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component="a"
              href={item.path}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

