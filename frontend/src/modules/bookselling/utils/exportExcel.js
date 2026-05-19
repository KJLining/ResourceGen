import * as XLSX from 'xlsx';

export function exportExcel({ title, period, salesData, profData, publisherData }) {
    const wb = XLSX.utils.book_new();

    // ── Sales Log sheet ──
    const salesRows = [
        [`${title} — ${period}`],
        ['Sales Log'],
        [],
        ['Ctrl #', 'Date', 'Student Name', 'Student No.', 'Course', 'Section', 'Professor', 'Book Title', 'Amount'],
        ...salesData.map(s => [
            s.control_number, s.sale_date, s.student_name, s.student_number,
            s.course, s.section, s.professor_name, s.book_title,
            Number(s.amount_collected),
        ]),
        [],
        ['', '', '', '', '', '', '', 'Total',
            salesData.reduce((a, s) => a + Number(s.amount_collected), 0)],
    ];
    const salesSheet = XLSX.utils.aoa_to_sheet(salesRows);
    salesSheet['!cols'] = [8, 12, 20, 15, 10, 10, 20, 30, 12].map(w => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, salesSheet, 'Sales Log');

    // ── Professor Commissions sheet ──
    const profRows = [
        [`${title} — ${period}`],
        ['Professor Commissions'],
        [],
        ['Professor', 'Books Prescribed', 'Total Copies Sold', 'Total Commission'],
        ...profData.map(p => [
            p.professor_name, p.books_prescribed,
            p.total_sold, Number(p.total_commission),
        ]),
        [],
        ['', '', 'Total', profData.reduce((a, p) => a + Number(p.total_commission), 0)],
    ];
    const profSheet = XLSX.utils.aoa_to_sheet(profRows);
    profSheet['!cols'] = [25, 30, 18, 18].map(w => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, profSheet, 'Prof Commissions');

    // ── Publisher Remittances sheet ──
    const pubRows = [
        [`${title} — ${period}`],
        ['Publisher Remittances'],
        [],
        ['Publisher', 'Books Supplied', 'Total Copies Sold', 'Total to Remit'],
        ...publisherData.map(p => [
            p.publisher_name, p.books_supplied,
            p.total_sold, Number(p.total_remittance),
        ]),
        [],
        ['', '', 'Total', publisherData.reduce((a, p) => a + Number(p.total_remittance), 0)],
    ];
    const pubSheet = XLSX.utils.aoa_to_sheet(pubRows);
    pubSheet['!cols'] = [25, 30, 18, 18].map(w => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, pubSheet, 'Publisher Remittances');

    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.xlsx`);
}