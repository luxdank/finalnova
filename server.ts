import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const CSV_FILE = path.join(__dirname, 'planilha_leads.csv');

  app.use(express.json());

  // Initialize CSV if not exists
  if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(
      CSV_FILE,
      'DataHora;Nome;CPF;Telefone;Email;Bairro;CEP;Rua;Numero;Complemento;Plano;ValorMensal\n',
      'utf-8'
    );
  }

  // API to submit lead to spreadsheet
  app.post('/api/leads', (req, res) => {
    try {
      const { name, cpf, phone, email, neighborhood, cep, street, number, complement, planName, planPrice } = req.body;
      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const row = `"${date}";"${name || ''}";"${cpf || ''}";"${phone || ''}";"${email || ''}";"${neighborhood || ''}";"${cep || ''}";"${street || ''}";"${number || ''}";"${complement || ''}";"${planName || ''}";"${planPrice || ''}"\n`;

      fs.appendFileSync(CSV_FILE, row, 'utf-8');
      res.json({ success: true, message: 'Dados gravados na planilha com sucesso!' });
    } catch (err: any) {
      console.error('Error saving lead to spreadsheet:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API proxy to send lead to Google Apps Script Webhook (server-side, avoids no-cors)
  app.post('/api/leads-to-sheets', async (req, res) => {
    try {
      const { webhookUrl, ...lead } = req.body;
      if (!webhookUrl) {
        return res.status(400).json({ success: false, error: 'URL do Apps Script não fornecida.' });
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });

      const responseText = await response.text();

      if (!response.ok) {
        return res.status(502).json({
          success: false,
          error: `Apps Script retornou ${response.status}: ${responseText}`,
        });
      }

      res.json({ success: true, message: 'Lead enviado ao Google Apps Script com sucesso!', data: responseText });
    } catch (err: any) {
      console.error('Error proxying to Apps Script:', err);
      res.status(502).json({ success: false, error: err.message });
    }
  });

  // API to retrieve leads from spreadsheet
  app.get('/api/leads', (req, res) => {
    try {
      if (!fs.existsSync(CSV_FILE)) {
        return res.json({ leads: [] });
      }
      const content = fs.readFileSync(CSV_FILE, 'utf-8');
      const lines = content.trim().split('\n');
      if (lines.length <= 1) return res.json({ leads: [] });

      const leads = lines.slice(1).map((line, idx) => {
        const values = line.split(';').map((v) => v.replace(/^"|"$/g, ''));
        return {
          id: idx + 1,
          date: values[0] || '',
          name: values[1] || '',
          cpf: values[2] || '',
          phone: values[3] || '',
          email: values[4] || '',
          neighborhood: values[5] || '',
          cep: values[6] || '',
          street: values[7] || '',
          number: values[8] || '',
          complement: values[9] || '',
          planName: values[10] || '',
          planPrice: values[11] || '',
        };
      });

      res.json({ leads });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API to download the CSV spreadsheet
  app.get('/api/leads/download', (req, res) => {
    if (fs.existsSync(CSV_FILE)) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="planilha_leads_novaisp.csv"');
      const content = fs.readFileSync(CSV_FILE, 'utf-8');
      // Include UTF-8 BOM so Excel opens accents correctly
      res.send('\uFEFF' + content);
    } else {
      res.status(404).send('Planilha vazia');
    }
  });

  // Mount Vite in dev mode
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on port ${PORT}`);
  });
}

startServer();
