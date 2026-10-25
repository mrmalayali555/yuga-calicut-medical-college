"use client";

import { jsPDF } from "jspdf";
import QRCode from "qrcode";

interface TicketPdfData {
  ticketId: string;
  eventName: string;
  date: string;
  venue: string;
  tier: string;
  attendeeName?: string;
  attendeeEmail?: string;
  attendeeAdditional?: string;
}

/**
 * Downloads high-resolution, print-ready digital entry pass PDF
 */
export async function downloadTicketPdf(data: TicketPdfData) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [105, 175], // Standard digital pass aspect ratio (105mm x 175mm)
    });

    const ticketId = data.ticketId || "YUG-TICKET";
    const attendeeName = data.attendeeName || "Registered Delegate";
    const attendeeEmail = data.attendeeEmail || "verified@gmc.edu";
    const tier = data.tier || "STUDENT DELEGATE";

    // Generate real QR code image
    const qrDataUrl = await QRCode.toDataURL(ticketId, {
      margin: 1,
      width: 300,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
    });

    // 1. Background (warm off-white paper color)
    doc.setFillColor(251, 250, 246);
    doc.rect(0, 0, 105, 175, "F");

    // 2. Outer decorative border
    doc.setDrawColor(228, 224, 212);
    doc.setLineWidth(0.6);
    doc.roundedRect(4, 4, 97, 167, 4, 4, "S");

    // 3. Header: Union info
    doc.setTextColor(255, 46, 86); // Crimson accent
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("GOVERNMENT MEDICAL COLLEGE, KOZHIKODE", 52.5, 12, { align: "center" });

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text("COLLEGE UNION 2026–2027 · OFFICIAL ENTRY PASS", 52.5, 15.5, { align: "center" });

    // 4. Ticket Title Banner
    doc.setFillColor(15, 23, 42); // Dark slate banner
    doc.roundedRect(8, 19, 89, 13, 2, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("YUGA '26", 13, 27.5);

    doc.setTextColor(255, 46, 86);
    doc.setFontSize(7.5);
    doc.text("#" + ticketId, 92, 27.5, { align: "right" });

    // 5. Event Details
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(data.eventName || "Medical Cultural Fest", 10, 39);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("All-Kerala Inter-Collegiate Cultural Festival", 10, 43.5);

    // 6. Meta Grid (Date, Venue, Admit Status)
    doc.setFillColor(243, 241, 233);
    doc.roundedRect(8, 47, 89, 18, 2, 2, "F");

    // Date
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("DATE", 12, 52);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(data.date || "Nov 19 – 22, 2026", 12, 57);

    // Venue
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.text("VENUE", 45, 52);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(data.venue || "Open Air Auditorium", 45, 57);

    // Tier
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.text("ADMISSION", 78, 52);
    doc.setTextColor(217, 119, 6); // Amber
    doc.setFontSize(7.5);
    doc.text(tier, 78, 57);

    // 7. Perforation notches & cut line
    doc.setDrawColor(203, 198, 182);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(8, 71, 97, 71);
    doc.setLineDashPattern([], 0); // reset

    // Circular left/right notches
    doc.setFillColor(255, 255, 255);
    doc.circle(4, 71, 3.5, "FD");
    doc.circle(101, 71, 3.5, "FD");

    // 8. Attendee Information
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("DELEGATE NAME", 10, 78);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(attendeeName, 10, 83);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(attendeeEmail, 10, 88);

    if (data.attendeeAdditional) {
      doc.setFontSize(6.5);
      doc.text(data.attendeeAdditional, 10, 92);
    }

    // 9. QR Code Pass (Center piece)
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(27.5, 96, 50, 50, 3, 3, "FD");
    doc.addImage(qrDataUrl, "PNG", 30, 98.5, 45, 45);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("GATE SCAN CODE", 52.5, 150, { align: "center" });

    // 10. Simulated Barcode at Bottom
    doc.setFillColor(15, 23, 42);
    const barcodeX = 22;
    const barcodeY = 154;
    const barWidths = [1, 0.4, 0.8, 1.2, 0.4, 1, 0.8, 0.4, 1.2, 0.8, 0.4, 1, 0.4, 1.2, 0.8, 0.4, 1, 0.8, 0.4, 1.2, 0.8, 0.4, 1, 0.4, 0.8];
    let curX = barcodeX;
    barWidths.forEach((w) => {
      doc.rect(curX, barcodeY, w, 5.5, "F");
      curX += w + 0.5;
    });

    doc.setTextColor(148, 163, 184);
    doc.setFont("courier", "bold");
    doc.setFontSize(6.5);
    doc.text(ticketId, 52.5, 163, { align: "center" });

    // 11. Security Note
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.text("Non-transferable · Present at entry gate counter · YUGA 2026", 52.5, 167.5, { align: "center" });

    // Save PDF
    doc.save(`YUGA-Pass-${ticketId}.pdf`);
    return true;
  } catch (error) {
    console.error("Failed to generate ticket PDF:", error);
    throw error;
  }
}
