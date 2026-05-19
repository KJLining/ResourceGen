import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportPDF({ title, period, salesData, profData, publisherData }) {
    const doc = new jsPDF({ orientation: 'landscape' });
    let y = 14;

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${period}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 8;

    // Sales Log Table
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Log', 14, y);
    y += 4;

    autoTable(doc, {
        startY: y,
        head: [['Ctrl #', 'Date', 'Student Name', 'Course & Section', 'Professor', 'Book Title', 'Amount']],
        body: salesData.map(s => [
            s.control_number,
            s.sale_date,
            s.student_name,
            `${s.course} ${s.section}`,
            s.professor_name,
            s.book_title,
            `₱ ${Number(s.amount_collected).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
        ]),
        foot: [[
            '', '', '', '', '', 'Total',
            `₱ ${salesData.reduce((a, s) => a + Number(s.amount_collected), 0)
                .toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
        ]],
        headStyles: { fillColor: [22, 101, 52] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 8 },
    });

    // Professor Commissions Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Professor Commissions', 14, doc.lastAutoTable.finalY + 10);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14,
        head: [['Professor', 'Books Prescribed', 'Total Copies Sold', 'Total Commission']],
        body: profData.map(p => [
            p.professor_name,
            p.books_prescribed,
            p.total_sold,
            `₱ ${Number(p.total_commission).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
        ]),
        foot: [[
            '', '', 'Total',
            `₱ ${profData.reduce((a, p) => a + Number(p.total_commission), 0)
                .toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
        ]],
        headStyles: { fillColor: [22, 101, 52] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 8 },
    });

    // Publisher Remittances Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Publisher Remittances', 14, doc.lastAutoTable.finalY + 10);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14,
        head: [['Publisher', 'Books Supplied', 'Total Copies Sold', 'Total to Remit']],
        body: publisherData.map(p => [
            p.publisher_name,
            p.books_supplied,
            p.total_sold,
            `₱ ${Number(p.total_remittance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
        ]),
        foot: [[
            '', '', 'Total',
            `₱ ${publisherData.reduce((a, p) => a + Number(p.total_remittance), 0)
                .toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
        ]],
        headStyles: { fillColor: [22, 101, 52] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 8 },
    });

    doc.save(`${title.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`);
}