export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const profileData = req.body;
    
    // --- BƯỚC QUAN TRỌNG: LƯU VÀO CSDL CỦA BẠN ---
    // Tại đây, bạn sẽ thêm code để kết nối và lưu `profileData`
    // vào cơ sở dữ liệu của mình (ví dụ: MongoDB, Firebase, PostgreSQL, v.v.).
    // Dưới đây là ví dụ giả lập.
    console.log("Đang lưu profile vào CSDL của nhà phát triển:", profileData);
    // Ví dụ với MongoDB:
    // const client = await clientPromise;
    // const db = client.db("your_db_name");
    // await db.collection("user_profiles").insertOne(profileData);
    // --- KẾT THÚC PHẦN LƯU VÀO CSDL ---

    // Phản hồi thành công cho client
    return res.status(200).json({ success: true, message: 'Profile saved successfully' });

  } catch (error) {
    console.error('Lỗi khi lưu profile:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
