import { useState, useEffect } from "react";
import { FileText, Download, Search, Eye, Filter } from "lucide-react";
import { apiFetch } from "../utils/api";

interface Invoice {
  id: number;
  invoice_number: string;
  client_name: string;
  total: number;
  issue_date: string;
  amount: number;
  client_dni?: string;
  client_email?: string;
  client_phone?: string;
  method?: string;
  payment_date?: string;
}

import Modal from "../components/Modal";
import { Printer } from "lucide-react";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await apiFetch("/invoices");
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleViewInvoice = async (id: number) => {
    try {
      const res = await apiFetch(`/invoices/${id}`);
      const data = await res.json();
      setSelectedInvoice(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const handlePrint = () => {
    const windowUrl = "about:blank";
    const uniqueName = new Date();
    const windowName = "Print" + uniqueName.getTime();
    const printWindow = window.open(
      windowUrl,
      windowName,
      "left=50,top=50,width=800,height=900",
    );

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Factura ${selectedInvoice?.invoice_number}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 24px; margin-bottom: 32px; }
              .brand { color: #7c3aed; font-size: 28px; font-weight: 800; }
              .invoice-info { text-align: right; }
              .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              table { width: 100%; border-collapse: collapse; margin-top: 24px; }
              th { background: #f9fafb; text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 11px; font-weight: 600; text-transform: uppercase; }
              td { padding: 16px 12px; border-bottom: 1px solid #f3f4f6; }
              .total-box { margin-top: 32px; padding: 24px; background: #f9fafb; border-radius: 12px; text-align: right; }
              .total-amount { font-size: 24px; font-weight: 800; color: #7c3aed; }
              .footer { margin-top: 64px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; padding-top: 24px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="brand">GYMPAY</div>
                <div style="color: #6b7280; font-size: 14px;">Comprobante de Pago</div>
              </div>
              <div class="invoice-info">
                <div class="section-title">Factura No.</div>
                <div style="font-family: monospace; font-weight: 700; font-size: 18px;">${selectedInvoice?.invoice_number}</div>
                <div style="margin-top: 4px; color: #6b7280;">${new Date(selectedInvoice?.issue_date || "").toLocaleDateString()}</div>
              </div>
            </div>
            
            <div class="grid">
              <div>
                <div class="section-title">Cliente</div>
                <div style="font-weight: 700; font-size: 16px;">${selectedInvoice?.client_name}</div>
                <div style="color: #4b5563;">DNI: ${selectedInvoice?.client_dni || "N/A"}</div>
              </div>
              <div>
                <div class="section-title">Método de Pago</div>
                <div style="font-weight: 600;">${selectedInvoice?.method || "Efectivo"}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th style="text-align: right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pago de Membresía Gimnasio</td>
                  <td style="text-align: right; font-weight: 700;">$${selectedInvoice?.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="total-box">
              <div class="section-title">Total Pagado</div>
              <div class="total-amount">$${selectedInvoice?.total.toLocaleString()}</div>
            </div>

            <div class="footer">
              Este es un comprobante oficial emitido por GYMPAY. Gracias por su pago.
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Facturación
          </h1>
          <p className="text-gray-500">
            Consulta y descarga comprobantes de pago
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cliente o número de factura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Factura #
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-900 font-bold">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {inv.client_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(inv.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${inv.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewInvoice(inv.id)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleViewInvoice(inv.id)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Vista Previa de Factura */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalles de Factura"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Número de Factura
                </p>
                <p className="text-xl font-mono font-bold text-gray-900">
                  {selectedInvoice.invoice_number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Fecha de Emisión
                </p>
                <p className="text-gray-900 font-medium">
                  {new Date(selectedInvoice.issue_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Datos del Cliente
                </h4>
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">
                    {selectedInvoice.client_name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    DNI: {selectedInvoice.client_dni || "N/A"}
                  </p>
                  {selectedInvoice.client_email && (
                    <p className="text-gray-500 text-sm">
                      {selectedInvoice.client_email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Detalles del Pago
                </h4>
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">
                    Monto: ${selectedInvoice.total.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Método: {selectedInvoice.method}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Imprimir / Descargar PDF
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
