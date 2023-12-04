import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { endOfDay, startOfDay } from 'date-fns';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardLayout } from '../../components/dashboard-layout';
import { FilterAlt } from '@mui/icons-material';
import { ReportListFilters } from '../../components/reports/report-list-filters';
import { ReportListTable } from '../../components/reports/report-list-table';
import ReportsApi, { ReportMetadata } from "../../apis/reports-api";
import { useSession } from 'next-auth/react';
import { useDashboardContext } from '../../contexts/dashboard-context';

const applyPagination = (logs, page, rowsPerPage) => logs.slice(page * rowsPerPage,
  page * rowsPerPage + rowsPerPage);

const LogsListInner = styled('div',
  { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }: {theme: any, open: boolean}) => ({
      flexGrow: 1,
      overflow: 'hidden',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      zIndex: 1,
      marginLeft: -380,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      ...(open && {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        })
      })
    }));

const Page = () => {
  const rootRef = useRef(null);
  const { data: session } = useSession();
  const { intersectionId } = useDashboardContext();
  
  const [group, setGroup] = useState(true);
  const [logs, setLogs] = useState<ReportMetadata[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openFilters, setOpenFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    endDate: new Date(),
    startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    logLevel: "ERROR",
    customer: []
  });

  const listReports = async (start_timestamp: Date, end_timestamp: Date, intersectionId: number) => {
    if (!session?.accessToken) {
      console.error(
        "Did not attempt to list reports. Access token:",
        session?.accessToken,
      );
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      let data = await ReportsApi.listReports({token: session.accessToken, intersection_id: intersectionId, startTime: start_timestamp, endTime: end_timestamp}) ?? [];
      setLogs(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => listReports(filters.startDate, filters.endDate, intersectionId), 300);
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, intersectionId]);

  const handleChangeGroup = (event) => {
    setGroup(event.target.checked);
  };

  const handleToggleFilters = () => {
    setOpenFilters((prevState) => !prevState);
  };

  const handleChangeFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleCloseFilters = () => {
    setOpenFilters(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const paginatedLogs = applyPagination(logs, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Logs List
        </title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <ReportListFilters
          containerRef={rootRef}
          filters={filters}
          onChange={handleChangeFilters}
          onClose={handleCloseFilters}
          open={openFilters}
          loading={loading}
        />
        <LogsListInner open={openFilters} theme={undefined}>
          <Box sx={{ mb: 3 }}>
            <Stack
              
              spacing={3}
              maxWidth="sm"
            >
              <Typography variant="h4">
                Logs
              </Typography>
              <Box>
                <Button
                  endIcon={<FilterAlt fontSize="small" />}
                  onClick={handleToggleFilters}
                  // sx={{ m: 1 }}
                  variant="outlined"
                  fullWidth={false}
                  size="small"
                >
                  Filters
                </Button>
              </Box>
            </Stack>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
              }}
            >
            </Box>
          </Box>
          <ReportListTable
            group={group}
            reports={paginatedLogs}
            reportsCount={logs.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </LogsListInner>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
