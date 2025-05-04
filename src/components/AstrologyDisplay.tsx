import React from 'react';
import {
  BasicAstrologyJsonResponse,
  DetailedAstrologyJsonResponse,
  AstrologyDisplayProps,
} from '@/types/astrology';

// Style có thể được quản lý tốt hơn bằng CSS Modules, Tailwind, hoặc Styled Components
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    maxWidth: '800px',
    margin: '20px auto',
    color: '#333', // Màu chữ mặc định
  },
  loading: { textAlign: 'center', fontSize: '1.2em', color: '#555' },
  error: {
    textAlign: 'center', fontSize: '1.1em', color: 'red',
    border: '1px solid red', padding: '10px', borderRadius: '4px',
    backgroundColor: '#ffebee',
  },
  section: {
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px dashed #eee',
  },
  lastSection: { marginBottom: '0', paddingBottom: '0', borderBottom: 'none' },
  heading: {
    color: '#222', // Đậm hơn chút
    fontSize: '1.3em', // Hơi nhỏ hơn
    marginBottom: '10px',
    borderBottom: '2px solid #eee',
    paddingBottom: '5px',
    fontWeight: 'bold',
  },
  subHeading: {
    color: '#444', fontSize: '1.15em', marginTop: '15px',
    marginBottom: '8px', fontWeight: '600'
  },
  content: { color: '#555', whiteSpace: 'pre-wrap' }, // Giữ pre-wrap
  note: {
    marginTop: '20px', padding: '15px', backgroundColor: '#fffbe6',
    border: '1px solid #ffe58f', borderRadius: '4px', color: '#8a6d3b',
    fontSize: '0.95em',
  },
  noteTitle: { fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  subsectionsContainer: { display: 'flex', flexDirection: 'column', gap: '15px' }, // Giảm gap
  subsection: {
    padding: '15px', border: '1px solid #ddd', borderRadius: '8px',
    // Bỏ background gradient phức tạp để dễ đọc hơn, có thể thêm lại nếu muốn
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  // Style cho từng subsection có thể đơn giản hóa hoặc dùng class
  subsectionCongDanh: { borderColor: '#4a90e2' },
  subsectionTaiLoc: { borderColor: '#50e3c2' },
  subsectionTinhDuyen: { borderColor: '#e91e63' },
  subsectionSucKhoe: { borderColor: '#f5a623' },
};

// Hàm kiểm tra xem có phải là kết quả chi tiết không
function isDetailedReading(
  data: any
): data is DetailedAstrologyJsonResponse {
  // Kiểm tra sự tồn tại của một trường chỉ có trong bản chi tiết
  return data && typeof data === 'object' && 'gioiThieuChung' in data;
}

// Helper components để cải thiện tái sử dụng code
const Section: React.FC<{ title: string; children: React.ReactNode; isLast?: boolean }> = ({ title, children, isLast }) => (
  <section className={`py-4 ${!isLast ? 'border-b border-border/30' : ''}`}>
    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3 pb-2 border-b border-border/50">{title}</h2>
    <div className="text-foreground/90 space-y-3 whitespace-pre-wrap leading-relaxed">
      {children}
    </div>
  </section>
);

const SubSection: React.FC<{ title: string; icon?: string; children: React.ReactNode; borderColorClass?: string }> = 
  ({ title, icon, children, borderColorClass = 'border-border' }) => (
  <div className={`bg-card/50 p-4 rounded-lg border-l-4 ${borderColorClass} shadow-sm`}>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h3>
    <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
      {children}
    </div>
  </div>
);

const AstrologyDisplay: React.FC<AstrologyDisplayProps> = ({
  readingData,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-card/50 border border-border rounded-lg shadow-sm">
        <div className="text-center text-muted-foreground py-10">
          <p className="text-lg animate-pulse">Đang tải phân tích tử vi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Hiển thị lỗi thân thiện hơn nếu đó là lỗi parsing hoặc API
    const displayError = error.includes("Không thể đọc được kết quả")
      ? "Đã có lỗi xảy ra khi xử lý dữ liệu tử vi. Nội dung có thể không đầy đủ hoặc không chính xác. Vui lòng thử lại."
      : `Lỗi: ${error}`;
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md" role="alert">
          <h4 className="font-bold mb-2">Lỗi</h4>
          <p>{displayError}</p>
        </div>
      </div>
    );
  }

  if (!readingData) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-card/50 border border-border rounded-lg shadow-sm">
        <p className="text-center text-muted-foreground py-10">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  // ---- Hiển thị kết quả chi tiết ----
  if (isDetailedReading(readingData)) {
    const data = readingData;
    return (
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8 shadow-lg max-w-4xl mx-auto space-y-6">
        {data.gioiThieuChung && <Section title="Giới thiệu chung"><p>{data.gioiThieuChung}</p></Section>}
        {data.canChiVaLichAm && <Section title="Can Chi và Lịch Âm"><p>{data.canChiVaLichAm}</p></Section>}
        {data.napAmAmDuongMang && <Section title="Nạp Âm, Âm Dương, Mạng"><p>{data.napAmAmDuongMang}</p></Section>}
        {data.yeuToCoDinh && <Section title="Yếu Tố Cố Định"><p>{data.yeuToCoDinh}</p></Section>}
        {data.cungMenhThan && <Section title="Cung Mệnh / Thân"><p>{data.cungMenhThan}</p></Section>}
        {data.saoChinhVaYnghia && <Section title="Sao Chính và Ý Nghĩa"><p>{data.saoChinhVaYnghia}</p></Section>}

        {/* Vận Mệnh Tổng Quan */}
        <Section title="Vận Mệnh Tổng Quan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {data.vanMenhTongQuan?.congDanh && 
              <SubSection title="Công Danh" icon="💼" borderColorClass="border-blue-500">
                <p>{data.vanMenhTongQuan.congDanh}</p>
              </SubSection>
            }
            {data.vanMenhTongQuan?.taiLoc && 
              <SubSection title="Tài Lộc" icon="💰" borderColorClass="border-green-500">
                <p>{data.vanMenhTongQuan.taiLoc}</p>
              </SubSection>
            }
            {data.vanMenhTongQuan?.tinhDuyen && 
              <SubSection title="Tình Duyên" icon="❤️" borderColorClass="border-pink-500">
                <p>{data.vanMenhTongQuan.tinhDuyen}</p>
              </SubSection>
            }
            {data.vanMenhTongQuan?.sucKhoe && 
              <SubSection title="Sức Khỏe" icon="🏥" borderColorClass="border-yellow-500">
                <p>{data.vanMenhTongQuan.sucKhoe}</p>
              </SubSection>
            }
          </div>
        </Section>

        {data.ketLuanVaLoiKhuyen && 
          <Section title="Kết Luận và Lời Khuyên" isLast={!data.luuY}>
            <p>{data.ketLuanVaLoiKhuyen}</p>
          </Section>
        }

        {data.luuY && (
          <div className="mt-6 bg-amber-50 border border-amber-300 text-amber-800 p-4 rounded-md text-sm">
            <p><strong className="font-semibold block mb-1">Lưu ý quan trọng:</strong></p>
            <p className="whitespace-pre-wrap leading-relaxed">{data.luuY}</p>
          </div>
        )}
      </div>
    );
  }

  // ---- Hiển thị kết quả cơ bản ----
  // Nếu không phải detailed thì mặc định là basic
  const data = readingData as BasicAstrologyJsonResponse;
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8 shadow-lg max-w-4xl mx-auto space-y-6">
      {data.tongQuan && <Section title="Tổng Quan"><p>{data.tongQuan}</p></Section>}
      {data.diemNoiBat && <Section title="Điểm Nổi Bật" isLast={!data.luuY}><p>{data.diemNoiBat}</p></Section>}
      {data.luuY && (
        <div className="mt-6 bg-amber-50 border border-amber-300 text-amber-800 p-4 rounded-md text-sm">
          <p><strong className="font-semibold block mb-1">Lưu ý:</strong></p>
          <p className="whitespace-pre-wrap leading-relaxed">{data.luuY}</p>
        </div>
      )}
    </div>
  );
};

export default AstrologyDisplay; 