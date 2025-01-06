import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardLayout } from "../../components/dashboard-layout";
import { FilterAlt } from "@mui/icons-material";
import { ReportListFilters } from "../../components/reports/report-list-filters";
import { ReportListTable } from "../../components/reports/report-list-table";
import ReportsApi, { ReportMetadata } from "../../apis/reports-api";
import { useSession } from "next-auth/react";
import { useDashboardContext } from "../../contexts/dashboard-context";
import { ReportGenerationDialog } from "../../components/reports/report-generation-dialog";
import ReportDetailsModal from '../../components/reports/report-details-modal';
import toast from "react-hot-toast";

const applyPagination = (logs, page, rowsPerPage) => logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const LogsListInner = styled("div", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }: { theme: any; open: boolean }) => ({
    flexGrow: 1,
    overflow: "hidden",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    zIndex: 1,
    marginLeft: -380,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Page = () => {
  const rootRef = useRef(null);
  const { data: session } = useSession();
  const { intersectionId, roadRegulatorId } = useDashboardContext();

  const [group, setGroup] = useState(true);
  const [logs, setLogs] = useState<ReportMetadata[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openFilters, setOpenFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    endDate: new Date(),
    startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    logLevel: "ERROR",
    customer: [],
  });
  const [openReportGenerationDialog, setOpenReportGenerationDialog] = useState(false);

  const listReports = async (
    start_timestamp: Date,
    end_timestamp: Date,
    intersectionId: number,
    roadRegulatorId: number
  ) => {
    if (!session?.accessToken) {
      console.error("Did not attempt to list reports. Access token:", session?.accessToken);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      let data =
        (await ReportsApi.listReports({
          token: session.accessToken,
          intersectionId,
          roadRegulatorId,
          startTime: start_timestamp,
          endTime: end_timestamp,
        })) ?? [];
      data = data.sort((a, b) => new Date(b.reportGeneratedAt).getTime() - new Date(a.reportGeneratedAt).getTime()); // Sort by reportGeneratedAt in descending order
      setLogs(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(
    () => {
      setLoading(true);
      setTimeout(() => listReports(filters.startDate, filters.endDate, intersectionId, roadRegulatorId), 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, intersectionId]
  );

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

  // Inside the parent component
  const [selectedReport, setSelectedReport] = useState<ReportMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewReport = (report: ReportMetadata) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleReportGenerated = () => {
    setOpenReportGenerationDialog(false);
    const refreshTime = new Date(Date.now() + 15 * 60 * 1000);
    toast.success(`Reports usually take 10-15 minutes to generate. Please refresh the page at ${refreshTime.toLocaleTimeString()} to see the new report.`);
  };

  return (
    <>
      <Head>
        <title>Reports List</title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <ReportListFilters
          containerRef={rootRef}
          filters={filters}
          onChange={handleChangeFilters}
          onClose={handleCloseFilters}
          open={openFilters}
          loading={loading}
          setOpenReportGenerationDialog={setOpenReportGenerationDialog}
        />
        <LogsListInner open={openFilters} theme={undefined}>
          <Box sx={{ mb: 3 }}>
            <Stack spacing={3} maxWidth="sm">
              <Typography variant="h4">Reports</Typography>
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
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
              }}
            ></Box>
          </Box>
          <ReportListTable
            group={group}
            reports={paginatedLogs}
            reportsCount={logs.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onViewReport={handleViewReport}
          />
        </LogsListInner>
      </Box>
      <ReportGenerationDialog
        open={openReportGenerationDialog}
        onClose={() => {
          setOpenReportGenerationDialog(false);
        }}
        onReportGenerated={handleReportGenerated}
      />
      <ReportDetailsModal
        open={isModalOpen}
        onClose={handleCloseReportModal}
        report={selectedReport}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;