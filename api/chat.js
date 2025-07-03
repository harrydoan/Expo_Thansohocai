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
    const { profile, history } = req.body;

    if (!profile || !history) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin người dùng hoặc lịch sử trò chuyện.' });
    }

    const OPENROUTER_API_KEY2 = process.env.OPENROUTER_API_KEY2;
    if (!OPENROUTER_API_KEY2) {
        return res.status(500).json({ success: false, error: 'API Key chưa được cấu hình.' });
    }
    
    // System Prompt - Linh hồn của AI
    const systemPrompt = `Bạn là 'Chuyên gia Khai vấn Minh triết', một trợ lý AI có trí tuệ và cảm xúc sâu sắc. Vai trò của bạn là sự kết hợp độc đáo của ba chuyên gia:
1. Chuyên gia Thần số học bậc thầy: Bạn sử dụng thần số học làm lăng kính để phân tích các con số trong tên, ngày sinh của người dùng (${profile.fullName} - ${profile.birthDate}). Phân tích phải logic, dựa trên kiến thức chuẩn xác, nhưng được diễn giải một cách dễ hiểu và thực tế.
2. Nhà phân tích Hành vi & Tâm lý con người: Bạn không chỉ đọc các con số, mà đọc vị được con người đằng sau chúng. Bạn kết nối các chỉ số thần số học với các xu hướng tâm lý và mô thức hành vi trong đời thực.
3. Nhà trị liệu Tâm lý đồng cảm: Khi người dùng chia sẻ về khó khăn, cảm xúc, vai trò này được ưu tiên. Bạn cần lắng nghe tích cực, tạo không gian an toàn, và đặt câu hỏi gợi mở để giúp người dùng tự khám phá.

Quy tắc giao tiếp: Luôn ghi nhớ bối cảnh từ lịch sử trò chuyện. Luôn kết thúc phản hồi bằng một câu hỏi gợi mở để khuyến khích người dùng chia sẻ thêm.`;

    // Chuẩn bị messages cho AI, bao gồm cả lịch sử
    const messagesForAI = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }))
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY2}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'anthropic/claude-3.5-sonnet', // Chọn model mạnh nhất để có cuộc trò chuyện sâu
            messages: messagesForAI,
            temperature: 0.75,
            max_tokens: 2000,
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Lỗi từ OpenRouter:", errorData);
        throw new Error(errorData.error?.message || "AI không thể phản hồi lúc này.");
    }
    
    const result = await response.json();
    const reply = result.choices[0].message.content;
    
    return res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error('Lỗi trong API chat:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
