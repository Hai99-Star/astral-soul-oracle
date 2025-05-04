import React, { useState } from 'react';
import { BasicAstrologyJsonResponse, DetailedAstrologyJsonResponse } from '@/types/astrology';
import AstrologyDisplay from './AstrologyDisplay';
import { Button } from '@/components/ui/button';

// Mẫu dữ liệu ĐÃ PARSE
const sampleDetailedObject: DetailedAstrologyJsonResponse = {
    gioiThieuChung: "Chào mừng Nguyễn Văn B đến với bản luận giải tử vi chi tiết (Demo JSON). Phân tích này dựa trên thông tin bạn cung cấp.",
    canChiVaLichAm: "Ngày sinh dương lịch 20/05/1995 tương ứng ngày 21 tháng 4 năm Ất Hợi. Giờ sinh Mão (05:00-06:59). Năm Ất Hợi, tháng Tân Tỵ, ngày Canh Dần, giờ Kỷ Mão.",
    napAmAmDuongMang: "Nạp Âm: Sơn Đầu Hỏa (Lửa trên núi). Âm Nam. Mệnh Hỏa gặp năm Hỏa là tương hòa, tốt.",
    cungMenhThan: "Cung Mệnh an tại Dần có sao Tham Lang. Cung Thân cư Quan Lộc tại Tuất có sao Vũ Khúc, Liêm Trinh. Mệnh Tham Lang chủ về ham muốn, tài năng đa dạng. Thân cư Quan Lộc cho thấy hậu vận tập trung vào sự nghiệp, danh tiếng.",
    saoChinhVaYnghia: "Mệnh có Tham Lang (Đào hoa tinh, Phúc tinh) gặp Hóa Lộc: Thông minh, khéo léo, có duyên kinh doanh, nghệ thuật. Quan Lộc có Vũ Khúc (Tài tinh), Liêm Trinh (Tù tinh, Đào hoa thứ) gặp Hóa Kỵ: Sự nghiệp có tài nhưng gặp nhiều cạnh tranh, thị phi, cần cẩn trọng lời nói.",
    vanMenhTongQuan: {
        congDanh: "Sự nghiệp có tiềm năng lớn nhưng không bằng phẳng. Cần nỗ lực và kiên trì vượt qua thử thách. Hợp với kinh doanh, tài chính, nghệ thuật.",
        taiLoc: "Tài lộc tốt, có khả năng kiếm tiền nhưng cũng dễ hao tán do Tham Lang. Cần quản lý chi tiêu chặt chẽ.",
        tinhDuyen: "Đào hoa vượng (Tham Lang, Liêm Trinh), tình duyên phong phú nhưng cũng dễ gặp rắc rối. Cần sự chung thủy và rõ ràng trong các mối quan hệ.",
        sucKhoe: "Chú ý các bệnh về gan, hệ tiêu hóa (do Tham Lang). Tránh rượu bia, chất kích thích. Cần giữ tâm trạng thoải mái."
    },
    ketLuanVaLoiKhuyen: "Bạn là người tài năng, có nhiều cơ hội nhưng cũng cần tiết chế ham muốn, cẩn trọng trong lời nói và quản lý tài chính. Tập trung phát triển sự nghiệp một cách bền vững.",
    luuY: "Phân tích này chỉ mang tính tham khảo dựa trên các nguyên tắc cơ bản của Tử Vi. Cần kết hợp với yếu tố thực tế và đại vận, lưu niên để có cái nhìn chính xác nhất."
};

const sampleBasicObject: BasicAstrologyJsonResponse = {
    tongQuan: "Đây là phân tích tổng quan cơ bản cho Nguyễn Văn A (Demo Basic). Bạn sinh năm Canh Ngọ, thuộc mệnh Lộ Bàng Thổ.",
    diemNoiBat: "Người tuổi Ngọ mệnh Thổ thường năng động, nhiệt tình nhưng cũng có phần thẳng thắn. Bạn có ý chí, thích khám phá nhưng cần kiên trì hơn để đạt mục tiêu lớn.",
    luuY: "Phân tích này chỉ dựa trên năm sinh, chưa bao gồm các yếu tố chi tiết từ giờ sinh.",
};

const AstrologyResultDemo: React.FC = () => {
    const [activeResultData, setActiveResultData] = useState<BasicAstrologyJsonResponse | DetailedAstrologyJsonResponse | null>(null);
    const [activeDemoType, setActiveDemoType] = useState<'basic' | 'detailed' | null>(null);

    const showDetailedDemo = () => {
        setActiveResultData(sampleDetailedObject);
        setActiveDemoType('detailed');
    };

    const showBasicDemo = () => {
        setActiveResultData(sampleBasicObject);
        setActiveDemoType('basic');
    };

    const hideResult = () => {
        setActiveResultData(null);
        setActiveDemoType(null);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-primary">Demo Hiển Thị Kết Quả Tử Vi</h2>
                <p className="text-muted-foreground mt-2">
                    Kiểm tra component <code>AstrologyDisplay</code> với dữ liệu đã được phân tích.
                </p>
            </div>

            {/* Nút điều khiển */}
            <div className="flex justify-center space-x-4 mb-8">
                {!activeResultData ? (
                    <>
                        <Button onClick={showBasicDemo} variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/20">
                            Xem Demo (Cơ bản - Parsed)
                        </Button>
                        <Button onClick={showDetailedDemo} variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/20">
                            Xem Demo (Chi tiết - Parsed)
                        </Button>
                    </>
                ) : (
                    <Button onClick={hideResult} variant="destructive">
                        Ẩn kết quả demo ({activeDemoType})
                    </Button>
                )}
            </div>

            {/* Khu vực hiển thị kết quả */}
            {activeResultData && (
                <div className="max-w-4xl mx-auto transition-opacity duration-500 ease-in-out opacity-100">
                    <AstrologyDisplay
                        // Truyền dữ liệu object đã parse
                        readingData={activeResultData}
                        // Demo không có trạng thái loading/error thực tế từ API
                        isLoading={false}
                        error={null}
                    />
                    {/* Nút Back có thể không cần thiết nếu demo chỉ để hiển thị */}
                    <div className="text-center mt-4">
                        <Button onClick={hideResult} variant="outline">Ẩn Demo</Button>
                    </div>
                </div>
            )}

            {/* Phần hướng dẫn */}
            <div className="mt-10 p-6 border border-purple-800/30 rounded-lg bg-card/50 max-w-4xl mx-auto">
                <h3 className="text-xl font-serif text-primary mb-4">Hướng dẫn</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Nhấn nút "Xem Demo" để kiểm tra component <code>AstrologyDisplay</code> với dữ liệu mẫu đã được phân tích thành object JavaScript.</li>
                    <li>Component này nhận prop <code>readingData</code> là một object (hoặc null), cùng với <code>isLoading</code> và <code>error</code>.</li>
                    <li>Việc xử lý chuỗi JSON gốc từ API và fallback text nên được thực hiện ở lớp gọi API (như trong <code>AstrologyResultPage</code> hoặc context).</li>
                </ul>
            </div>
        </div>
    );
};

export default AstrologyResultDemo; 