import prisma from "./prisma.js";

export const logAudit = async ({
  user_id,
  action,
  table_name,
  record_id,
  old_data,
  new_data
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data
      }
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};




//  await logAudit({
//       user_id: req.user.id,
//       action: "UPDATE",
//       table_name: "products",
//       record_id: id,
//       old_data: oldProduct,
//       new_data: updatedProduct
//     });

//     res.json(updatedProduct);