import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { ReportMetadata } from '../../apis/reports-api';
import { extractLaneIds } from './report-utils';

const setPdfSectionTitleFormatting = (pdf: jsPDF) => {
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
};

const setPdfDescriptionFormatting = (pdf: jsPDF) => {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
};

const setPdfBodyFormatting = (pdf: jsPDF) => {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
};

const setPdfItemTitleFormatting = (pdf: jsPDF) => {
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
};

const captureGraph = async (pdf: jsPDF, elementId: string, position: { x: number, y: number }, setProgress: (progress: number) => void, totalGraphs: number, currentGraph: number) => {
  const input = document.getElementById(elementId);
  if (input) {
    const canvas = await html2canvas(input, { scale: 2 });
    input.style.width = '';
    input.style.height = '';
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 30;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', position.x + 15, position.y, imgWidth, imgHeight, undefined, 'FAST');
    setProgress((currentGraph / totalGraphs) * 100);
  }
};

const addDistanceFromCenterlineGraphs = async (pdf: jsPDF, laneIds: number[], pdfHeight: number, setProgress: (progress: number) => void, totalGraphs: number, currentGraph: number) => {
  if (laneIds.length === 0) {
    pdf.setFont('helvetica', 'normal');
    pdf.text('No Data', pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
    return;
  }
  for (let i = 0; i < laneIds.length; i++) {
    if (i % 2 === 0 && i !== 0) {
      pdf.addPage();
    }
    const position = i % 2 === 0 ? { x: 0, y: 35 } : { x: 0, y: pdfHeight / 2 + 10 };
    await captureGraph(pdf, `distance-from-centerline-graph-${laneIds[i]}`, position, setProgress, totalGraphs, currentGraph + i + 1);
  }
};

const addHeadingErrorGraphs = async (pdf: jsPDF, laneIds: number[], pdfHeight: number, setProgress: (progress: number) => void, totalGraphs: number, currentGraph: number) => {
  if (laneIds.length === 0) {
    pdf.setFont('helvetica', 'normal');
    pdf.text('No Data', pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
    return;
  }
  for (let i = 0; i < laneIds.length; i++) {
    if (i % 2 === 0 && i !== 0) {
      pdf.addPage();
    }
    const position = i % 2 === 0 ? { x: 0, y: 35 } : { x: 0, y: pdfHeight / 2 + 10 };
    await captureGraph(pdf, `heading-error-graph-${laneIds[i]}`, position, setProgress, totalGraphs, currentGraph + i + 1);
  }
};

export const generatePdf = async (report: ReportMetadata, setLoading: (loading: boolean) => void, includeLaneSpecificCharts: boolean, isModalOpen: () => boolean, setProgress: (progress: number) => void) => {
  setLoading(true);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const pdfWidth = pdf.internal.pageSize.getWidth();

  // Calculate total number of graphs
  const laneIds = extractLaneIds(report.laneDirectionOfTravelAssessmentCount || []);
  const totalGraphs = 15 + (includeLaneSpecificCharts ? 2 * laneIds.length : 0);

  let currentGraph = 0;

  pdf.setFontSize(36);
  pdf.text('Conflict Monitor Report', pdfWidth / 2, pdfHeight / 2 - 50, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`Intersection ${report.intersectionID}`,
    pdfWidth / 2, pdfHeight / 2 - 30, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`${report?.reportStartTime ? format(new Date(report.reportStartTime), "yyyy-MM-dd' T'HH:mm:ss'Z'") : ''} - ${report?.reportStopTime ? format(new Date(report.reportStopTime), "yyyy-MM-dd' T'HH:mm:ss'Z'") : ''}`,
    pdfWidth / 2, pdfHeight / 2 - 20, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Lane Direction of Travel', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  await captureGraph(pdf, 'lane-direction-of-travel-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed a lane segment.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'lane-direction-distance-graph', { x: 0, y: pdfHeight / 2 + 10 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The median deviation in distance between vehicles and the center of the lane as defined by the MAP.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  await captureGraph(pdf, 'lane-direction-heading-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The median deviation in heading between vehicles and the lanes as defined by the MAP.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2 + 10, { align: 'center' });
  pdf.addPage();

  if (includeLaneSpecificCharts) {
    // Add Distance From Centerline Graphs
    setPdfSectionTitleFormatting(pdf);
    pdf.text('Distance From Centerline Over Time',
      pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    setPdfDescriptionFormatting(pdf);
    pdf.text('The average of median distances between vehicles and the centerline of each lane as it changed over time.',
      pdf.internal.pageSize.getWidth() / 2, 32, { align: 'center' });
    await addDistanceFromCenterlineGraphs(pdf, laneIds, pdfHeight, setProgress, totalGraphs, currentGraph);
    currentGraph += laneIds.length;
    pdf.addPage();

    // Add Heading Error Graphs
    setPdfSectionTitleFormatting(pdf);
    pdf.text('Vehicle Heading Error Delta Over Time',
      pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    setPdfDescriptionFormatting(pdf);
    pdf.text('The median deviation in heading between vehicles and the expected heading as defined by the MAP.',
      pdf.internal.pageSize.getWidth() / 2, 32, { align: 'center' });
    await addHeadingErrorGraphs(pdf, laneIds, pdfHeight, setProgress, totalGraphs, currentGraph);
    currentGraph += laneIds.length;
    pdf.addPage();
  }

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Connection of Travel', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  await captureGraph(pdf, 'connection-of-travel-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed through the intersection.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  pdf.addPage();

  // Add Valid and Invalid Connection of Travel Graphs
  await captureGraph(pdf, 'valid-connection-of-travel-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of vehicles that followed the defined ingress-egress lane pairings for each lane at the intersection.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'invalid-connection-of-travel-graph', { x: 0, y: pdfHeight / 2 + 10 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of vehicles that did not follow the defined ingress-egress lane pairings for each lane at the intersection.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Signal State Events', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'signal-state-event-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed the stop line.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });

  await captureGraph(pdf, 'stop-line-stop-graph', { x: 0, y: pdfHeight / 2 + 10 }, setProgress, totalGraphs, ++currentGraph);
  pdf.text('The number of events triggered when vehicles stopped at the stop line.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  await captureGraph(pdf, 'signal-state-conflict-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of times the system detected contradictory signal states, such as two perpendicular green lights.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'time-change-details-graph', { x: 0, y: pdfHeight / 2 + 10 }, setProgress, totalGraphs, ++currentGraph);
  pdf.text('The number of times the system detected differences in timing between expected and actual signal state changes.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Intersection Reference Alignments Per Day', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  await captureGraph(pdf, 'intersection-reference-alignment-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events flagging a mismatch between intersection ID and road regulator ID.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  pdf.addPage();

  setPdfItemTitleFormatting(pdf);
  pdf.text('MAP', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  await captureGraph(pdf, 'map-broadcast-rate-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of times the system flagged more or less frequent MAP broadcasts than the expected rate of 1 Hz.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'map-minimum-data-graph', { x: 0, y: pdfHeight / 2 + 10 }, setProgress, totalGraphs, ++currentGraph);
  pdf.text('The number of times the system flagged MAP messages with missing or incomplete data.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });

  // Conditionally add MAP Missing Data Elements page
  if (report?.latestMapMinimumDataEventMissingElements?.length) {
    pdf.addPage();
    setPdfItemTitleFormatting(pdf);
    pdf.text('MAP Missing Data Elements', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    setPdfBodyFormatting(pdf);
    let yOffset = 30;
    report.latestMapMinimumDataEventMissingElements.forEach((element) => {
      const lines = pdf.splitTextToSize(element, pdf.internal.pageSize.getWidth() - 40);
      pdf.text(lines, 20, yOffset);
      yOffset += lines.length * 7; // Adjust yOffset based on the number of lines, reduced spacing
    });
  }

  pdf.addPage();
  setPdfItemTitleFormatting(pdf);
  pdf.text('SPaT', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  await captureGraph(pdf, 'spat-broadcast-rate-graph', { x: 0, y: 25 }, setProgress, totalGraphs, ++currentGraph);
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of times the system flagged more or less frequent SPaT broadcasts than the expected rate of 10 Hz.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'spat-minimum-data-graph', { x: 0, y: pdfHeight / 2 + 10 }, setProgress, totalGraphs, ++currentGraph);
  pdf.text('The number of times the system flagged SPaT messages with missing or incomplete data.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });

  // Conditionally add SPaT Missing Data Elements page
  if (report?.latestSpatMinimumDataEventMissingElements?.length) {
    pdf.addPage();
    setPdfSectionTitleFormatting(pdf);
    pdf.text('SPaT Missing Data Elements', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    setPdfBodyFormatting(pdf);
    let yOffset = 30;
    report.latestSpatMinimumDataEventMissingElements.forEach((element) => {
      const lines = pdf.splitTextToSize(element, pdf.internal.pageSize.getWidth() - 40);
      pdf.text(lines, 20, yOffset);
      yOffset += lines.length * 7; // Adjust yOffset based on the number of lines, reduced spacing
    });
  }

  if (isModalOpen()) {
    pdf.save(report?.reportName + ".pdf" || 'report.pdf');
  }
  setLoading(false);
};