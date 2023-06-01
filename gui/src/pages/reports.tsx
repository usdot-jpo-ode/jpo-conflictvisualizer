import { useState } from "react";
import Head from "next/head";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { ReportRequestEditForm } from "../components/reports/report-request-edit-form";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";
import ReportsApi from "../apis/reports-api";
import toast from "react-hot-toast";

const PerformanceReportPage = () => {
  const { intersectionId } = useDashboardContext();
  const { data: session } = useSession();

  const getReport = async ({ intersection_id, startTime, endTime }) => {
    if (!session?.accessToken) {
      return;
    }
    // const promise = new Promise((r) => setTimeout(r, 10000));
    const promise = ReportsApi.getReport({ token: session?.accessToken, intersection_id, startTime, endTime });
    toast.promise(promise, {
      loading: "Generating Performance Report",
      success: "Successfully Generated Performance Report",
      error: "Error Generating Performance Report",
    });
    const report = await promise;
    const name = `Performance Report ${new Date().toISOString()}.pdf`;
    if (report !== undefined) {
      downloadPdf(report, name);
    }
  };

  const downloadPdf = (contents: Blob, name: string) => {
    const url = window.URL.createObjectURL(contents);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name); //or any other extension
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <Head>
        <title>Performance Report</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div>
              <Typography noWrap variant="h4">
                Performance Report
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <ReportRequestEditForm onGenerateReport={getReport} dbIntersectionId={intersectionId} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

PerformanceReportPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PerformanceReportPage;