import prisma from "../lib/prisma.js";



export const getAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
      include: {
        user: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getLogsByRecord = async (req, res) => {
  try {
    const { table, id } = req.params;

    const logs = await prisma.auditLog.findMany({
      where: {
        table_name: table,
        record_id: Number(id)
      },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

