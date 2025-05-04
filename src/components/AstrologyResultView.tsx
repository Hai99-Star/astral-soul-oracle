import React from 'react';
import { AstrologyResult } from '@/types/astrology';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    User, Calendar, Clock, MapPin, Sparkles, Star, Sun, Moon, BookOpen,
    AlertTriangle, CheckCircle, PackageOpen, AlertCircle, Loader2, Wallet,
    Heart, Activity, Briefcase
} from 'lucide-react';

// --- Interfaces JSON (Giữ nguyên hoặc đảm bảo khớp API) ---
interface BasicAstrologyJsonResponse {
  tongQuan: string;
  diemNoiBat: string;
  luuY?: string;
  [key: string]: string | undefined;
}

interface DetailedAstrologyJsonResponse {
  gioiThieuChung: string;
  canChiVaLichAm: string;
  napAmAmDuongMang: string;
  yeuToCoDinh?: string;
  cungMenhThan?: string;
  saoChinhVaYnghia?: string;
  vanMenhTongQuan: {
    congDanh: string;
    taiLoc: string;
    tinhDuyen: string;
    sucKhoe: string;
  };
  ketLuanVaLoiKhuyen: string;
  luuY: string;
}

// --- Props Interface (Cho phép result là null) ---
interface AstrologyResultViewProps {
  result: AstrologyResult | null;
  isLoading: boolean;
  error: string | null;
  onBackClick?: () => void;
}

// --- Interface cho Section đã Parse (Nâng cấp) ---
interface ParsedSection {
  title: string;
  content: string;
  isHtml?: boolean; // Cờ: Nội dung có phải HTML từ fallback không?
  subSections?: ParsedSection[]; // Cho Vận Mệnh Tổng Quan
  isNote?: boolean; // Cờ: Đây có phải mục Lưu ý không?
}

// --- Hàm Parse JSON Robust (Nâng cấp từ câu trả lời trước) ---
const parseJsonResponseRobust = (reading: string | undefined | null): ParsedSection[] => {
  if (!reading) {
    console.warn("parseJsonResponseRobust: Reading string is empty or null.");
    return [];
  }

  // Log the raw reading at the beginning
  console.log("Raw reading:", reading.substring(0, 200) + (reading.length > 200 ? "..." : ""));
  
  try {
    console.log("Attempting JSON parse...");
    
    // Clean the string in case it has Markdown backticks or issues
    let cleanedReading = reading;
    if (reading.includes('```json')) {
      console.log("Found Markdown JSON code block, cleaning...");
      cleanedReading = reading
        .replace(/```json\s*/g, '')  // Remove ```json opener
        .replace(/\s*```\s*$/g, '')  // Remove ``` closer
        .trim();
    }
    
    const parsedJson = JSON.parse(cleanedReading);
    console.log("JSON parsing successful");

    // Kiểm tra cấu trúc dữ liệu cơ bản
    if (typeof parsedJson !== 'object' || parsedJson === null) {
      console.error("Parsed result is not an object:", parsedJson);
      throw new Error("Parsed result is not a valid object.");
    }

    const sections: ParsedSection[] = [];
    let luuYSection: ParsedSection | null = null; // Tách Lưu ý ra xử lý cuối
    
    // Xử lý Lưu ý trước nếu có, để thêm vào cuối
    if (parsedJson.luuY && typeof parsedJson.luuY === 'string') {
      luuYSection = { title: "Lưu Ý", content: parsedJson.luuY, isNote: true };
    }

    // Xác định cấu trúc detailed response
    const isDetailedReading = 
      typeof parsedJson.gioiThieuChung === 'string' && 
      typeof parsedJson.canChiVaLichAm === 'string' && 
      typeof parsedJson.napAmAmDuongMang === 'string' &&
      typeof parsedJson.vanMenhTongQuan === 'object' && 
      parsedJson.vanMenhTongQuan !== null;

    // Xác định cấu trúc basic response
    const isBasicReading = 
      typeof parsedJson.tongQuan === 'string' && 
      typeof parsedJson.diemNoiBat === 'string';

    // Xử lý detailed response
    if (isDetailedReading) {
      console.log("Detected validated Detailed Response structure");
      
      sections.push({ title: "Giới Thiệu Chung", content: parsedJson.gioiThieuChung });
      sections.push({ title: "Can Chi và Lịch Âm", content: parsedJson.canChiVaLichAm });
      sections.push({ title: "Nạp Âm và Âm Dương Mạng", content: parsedJson.napAmAmDuongMang });
      
      // Thêm các trường tùy chọn nếu có
      if (typeof parsedJson.yeuToCoDinh === 'string') {
        sections.push({ title: "Các Yếu Tố Cố Định", content: parsedJson.yeuToCoDinh });
      }
      
      if (typeof parsedJson.cungMenhThan === 'string') {
        sections.push({ title: "Cung Mệnh và Cung Thân", content: parsedJson.cungMenhThan });
      }
      
      if (typeof parsedJson.saoChinhVaYnghia === 'string') {
        sections.push({ title: "Các Sao Chính và Ý Nghĩa", content: parsedJson.saoChinhVaYnghia });
      }

      // Xử lý Vận Mệnh Tổng Quan
      if (parsedJson.vanMenhTongQuan) {
        const vanMenhObj = parsedJson.vanMenhTongQuan;
        const subSections: ParsedSection[] = [];
        
        // Kiểm tra từng trường trong vanMenhTongQuan
        if (typeof vanMenhObj.congDanh === 'string') {
          subSections.push({ title: "Công Danh", content: vanMenhObj.congDanh });
        } else {
          console.warn("Missing or invalid congDanh in vanMenhTongQuan");
        }
        
        if (typeof vanMenhObj.taiLoc === 'string') {
          subSections.push({ title: "Tài Lộc", content: vanMenhObj.taiLoc });
        } else {
          console.warn("Missing or invalid taiLoc in vanMenhTongQuan");
        }
        
        if (typeof vanMenhObj.tinhDuyen === 'string') {
          subSections.push({ title: "Tình Duyên", content: vanMenhObj.tinhDuyen });
        } else {
          console.warn("Missing or invalid tinhDuyen in vanMenhTongQuan");
        }
        
        if (typeof vanMenhObj.sucKhoe === 'string') {
          subSections.push({ title: "Sức Khỏe", content: vanMenhObj.sucKhoe });
        } else {
          console.warn("Missing or invalid sucKhoe in vanMenhTongQuan");
        }
        
        // Chỉ thêm section nếu có ít nhất một subsection
        if (subSections.length > 0) {
          sections.push({ title: "Vận Mệnh Tổng Quan", content: "", subSections });
        } else {
          console.error("No valid subsections found in vanMenhTongQuan");
        }
      }

      // Thêm kết luận nếu có
      if (typeof parsedJson.ketLuanVaLoiKhuyen === 'string') {
        sections.push({ title: "Kết Luận và Lời Khuyên", content: parsedJson.ketLuanVaLoiKhuyen });
      } else {
        console.warn("Missing ketLuanVaLoiKhuyen in detailed reading");
      }
    }
    // Xử lý basic response
    else if (isBasicReading) {
      console.log("Detected validated Basic Response structure");
      
      sections.push({ title: "Tổng Quan", content: parsedJson.tongQuan });
      sections.push({ title: "Điểm Nổi Bật", content: parsedJson.diemNoiBat });

      // Xử lý các trường bổ sung nếu có
      Object.entries(parsedJson).forEach(([key, value]) => {
        if (!['tongQuan', 'diemNoiBat', 'luuY'].includes(key) && typeof value === 'string') {
          const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          sections.push({ title, content: value });
        }
      });
    }
    // Xử lý JSON không khớp với cấu trúc đã biết
    else {
      console.warn("Unknown JSON structure:", Object.keys(parsedJson).join(', '));
      
      // Kiểm tra xem có phải JSON lỗi không
      if (parsedJson.error || parsedJson.message) {
        const errorMessage = parsedJson.error || parsedJson.message;
        console.error("Error message found in JSON:", errorMessage);
        return [{ 
          title: "Lỗi từ hệ thống", 
          content: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
          isNote: true 
        }];
      }
      
      // Cố gắng trích xuất dữ liệu từ các trường string
      let foundContent = false;
      
      Object.entries(parsedJson).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim() && key !== 'luuY') {
          const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          sections.push({ title, content: value });
          foundContent = true;
        }
      });
      
      if (!foundContent) {
        throw new Error("Cannot extract readable content from JSON response");
      }
    }

    // Thêm mục Lưu ý vào cuối nếu có
    if (luuYSection) {
      sections.push(luuYSection);
    }
     
    console.log("Successfully parsed sections:", sections.length);
    return sections;

  } catch (error) {
    console.error("JSON parsing failed:", error);
    console.log("Falling back to Markdown parser.");
    
    // Kiểm tra xem đây có phải là message lỗi ngắn không
    if (reading.length < 500 && !reading.includes('\n\n') && !reading.includes('##')) {
      return [{
        title: "Thông báo từ hệ thống",
        content: reading.replace(/\n/g, '<br />'),
        isNote: true,
        isHtml: true
      }];
    }
    
    // Sử dụng fallback parser nếu là nội dung dài
    const fallbackSections = parseMarkdownFallback(reading);
    return fallbackSections;
  }
};

// --- Hàm Parse Markdown Fallback (Cải thiện pattern matching) ---
const parseMarkdownFallback = (reading: string): ParsedSection[] => {
  console.log("Executing Markdown Fallback Parser...");
  
  if (!reading) return [];
  
  // Try multiple parsing strategies
  const sections: ParsedSection[] = [];
  
  // 1. First try Markdown headers using ## pattern (most reliable)
  if (reading.includes('## ')) {
    console.log("Found Markdown headers (##), parsing by headers");
    
    const lines = reading.split('\n');
    let currentTitle = "Nội dung tử vi";
    let currentContent = "";
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        // Save previous section if we have content
        if (currentContent) {
          sections.push({
            title: currentTitle,
            content: currentContent,
            isHtml: true
          });
          currentContent = "";
        }
        
        // Update title for new section
        currentTitle = trimmedLine.replace('## ', '');
      } else if (trimmedLine) {
        // Add to current content
        currentContent += trimmedLine + "<br />";
      }
    });
    
    // Add the last section
    if (currentContent) {
      sections.push({
        title: currentTitle,
        content: currentContent,
        isHtml: true
      });
    }
  } 
  // 2. Try to identify sections by blank lines and keyword patterns
  else {
    console.log("No Markdown headers found, attempting to identify sections by content patterns");
    
    // Split by double newlines (paragraph breaks)
    const paragraphs = reading.split('\n\n').filter(p => p.trim());
    
    // Improved keyword detection
    const keywordPatterns = [
      { pattern: /\b(giới thiệu|tổng quan|tổng quát)\b/i, title: "Tổng Quan" },
      { pattern: /\b(điểm nổi bật|điểm mạnh|đặc điểm|tính cách)\b/i, title: "Điểm Nổi Bật" },
      { pattern: /\b(can chi|lịch âm)\b/i, title: "Can Chi và Lịch Âm" },
      { pattern: /\b(nạp âm|âm dương|mệnh|mạng)\b/i, title: "Nạp Âm và Âm Dương Mạng" },
      { pattern: /\b(cung mệnh|cung thân)\b/i, title: "Cung Mệnh / Thân" },
      { pattern: /\b(sao chính|ý nghĩa|tinh tú)\b/i, title: "Sao Chính và Ý Nghĩa" },
      { pattern: /\b(vận mệnh|tổng quan vận mệnh|vận số|vận hạn)\b/i, title: "Vận Mệnh Tổng Quan" },
      { pattern: /\b(công danh|sự nghiệp|nghề nghiệp|công việc|sự nghiệp)\b/i, title: "Công Danh" },
      { pattern: /\b(tài lộc|tiền bạc|tài chính|của cải)\b/i, title: "Tài Lộc" },
      { pattern: /\b(tình duyên|hôn nhân|vợ chồng|bạn đời|tình cảm)\b/i, title: "Tình Duyên" },
      { pattern: /\b(sức khỏe|bệnh tật|thể trạng)\b/i, title: "Sức Khỏe" },
      { pattern: /\b(kết luận|lời khuyên|lời dặn|nhận xét|đề xuất)\b/i, title: "Kết Luận và Lời Khuyên" },
      { pattern: /\b(lưu ý|chú ý|cảnh báo|ghi nhớ|để ý)\b/i, title: "Lưu Ý", isNote: true }
    ];
    
    paragraphs.forEach((paragraph, index) => {
      // Default title if no match
      let title = "Phần " + (index + 1);
      let isNote = false;
      
      // Special case for first paragraph if it's short (likely intro)
      if (index === 0 && paragraph.length < 200) {
        title = "Giới thiệu";
      } else {
        // Try to match keywords
        const lowerPara = paragraph.toLowerCase();
        
        for (const { pattern, title: patternTitle, isNote: patternIsNote } of keywordPatterns) {
          if (pattern.test(lowerPara)) {
            title = patternTitle;
            isNote = !!patternIsNote;
            break;
          }
        }
      }
      
      sections.push({
        title,
        content: paragraph.replace(/\n/g, '<br />'),
        isHtml: true,
        isNote
      });
    });
  }
  
  // If we couldn't extract any sections, just return the whole content as one section
  if (sections.length === 0) {
    console.log("Could not identify sections, returning full content as one section");
    return [{
      title: "Phân tích tử vi",
      content: reading.replace(/\n/g, '<br />'),
      isHtml: true
    }];
  }
  
  return sections;
};


// --- Icon Mapping (Cập nhật icons) ---
const getSectionIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case 'giới thiệu chung':
      return <BookOpen className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'can chi và lịch âm':
      return <Sun className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'nạp âm và âm dương mạng':
      return <Moon className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'các yếu tố cố định':
      return <CheckCircle className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'cung mệnh và cung thân':
      return <User className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'các sao chính và ý nghĩa':
      return <Star className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'vận mệnh tổng quan':
      return <Sparkles className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    // Updated icons for Vận Mệnh Tổng Quan subsections with specific colors
    case 'công danh':
      return <Briefcase className="mr-3 h-5 w-5 text-indigo-400 shrink-0" />;
    case 'tài lộc':
      return <Wallet className="mr-3 h-5 w-5 text-emerald-400 shrink-0" />;
    case 'tình duyên':
      return <Heart className="mr-3 h-5 w-5 text-pink-400 shrink-0" />;
    case 'sức khỏe':
      return <Activity className="mr-3 h-5 w-5 text-orange-400 shrink-0" />;
    case 'kết luận và lời khuyên':
      return <CheckCircle className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'lưu ý quan trọng':
    case 'lưu ý':
      return <AlertTriangle className="mr-3 h-5 w-5 text-yellow-400 shrink-0" />;
    // Fallback for tổng quan and điểm nổi bật
    case 'tổng quan':
      return <BookOpen className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    case 'điểm nổi bật':
      return <Sparkles className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
    // Fallback cho trường hợp không có tiêu đề trùng khớp
    default:
      return <Sparkles className="mr-3 h-5 w-5 text-purple-400 shrink-0" />;
  }
};

// --- Component Chính (Áp dụng cải tiến) ---
const AstrologyResultView: React.FC<AstrologyResultViewProps> = ({
  result,
  isLoading,
  error,
  onBackClick
}) => {

  // --- Log full result object for debugging ---
  React.useEffect(() => {
    if (result) {
      console.log("Full result object:", result);
    }
  }, [result]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-purple-300">
        <Loader2 className="h-8 w-8 mr-3 animate-spin" />
        <span className="text-xl font-serif">Đang phân tích lá số...</span>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-900/30 border border-red-600 rounded-lg text-center text-red-200">
        <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-400" />
        <h3 className="text-xl font-semibold mb-2">Gặp sự cố</h3>
        <p className="mb-4">{error}</p>
        {onBackClick && (
          <Button variant="destructive" onClick={onBackClick}>
            Thử lại
          </Button>
        )}
      </div>
    );
  }

  // --- No Result State ---
  if (!result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-800/50 border border-gray-700 rounded-lg text-center text-gray-400">
        <PackageOpen className="h-10 w-10 mx-auto mb-4 text-gray-500" />
        <h3 className="text-xl font-semibold mb-2">Chưa có kết quả</h3>
        <p>Không tìm thấy dữ liệu phân tích tử vi.</p>
        {onBackClick && (
          <Button
            variant="outline"
            onClick={onBackClick}
            className="mt-4 border-purple-500 text-purple-300 hover:bg-purple-700/20 hover:text-purple-200"
          >
            Tạo phân tích mới
          </Button>
        )}
      </div>
    );
  }

  // --- Format Timestamp ---
  const formatTimestamp = (timestamp: number) => {
    try {
      return format(new Date(timestamp), 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch (e) { return 'Không rõ'; }
  };

  // --- Parse Reading Data (Sử dụng hàm robust) ---
  const parsedSections = parseJsonResponseRobust(result.reading);

  // --- Check for Parse Failure with Raw JSON ---
  const hasParseFailure = parsedSections.length === 1 && 
                          !parsedSections[0].title.includes('Phân tích tử vi') && 
                          parsedSections[0].isHtml && 
                          parsedSections[0].content === result.reading.replace(/\n/g, '<br />');

  // --- Main Render ---
  return (
    <div className="astrology-result-container max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 shadow-xl border border-purple-600/70 transition-all duration-300 hover:shadow-purple-500/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-2xl md:text-3xl font-serif text-purple-200 flex items-center">
            <User className="h-6 w-6 md:h-7 md:w-7 mr-3 text-purple-400 shrink-0" />
            {result.name}
          </h2>
          <Badge
            variant={result.isDetailed ? "default" : "secondary"}
            className={`text-xs md:text-sm px-3 py-1 whitespace-nowrap rounded-full ${result.isDetailed ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-700 text-purple-300 border border-purple-600'}`}
          >
            {result.isDetailed ? 'Chi tiết' : 'Cơ bản'}
          </Badge>
        </div>
        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300 mt-3 border-t border-purple-800/50 pt-4">
          <div className="flex items-center" title="Ngày tháng năm sinh">
            <Calendar className="h-4 w-4 mr-2 text-purple-400 shrink-0" />
            <span className="font-medium text-gray-100">{result.birthDate}</span>
          </div>
          {result.birthTime && (
            <div className="flex items-center" title="Giờ sinh">
              <Clock className="h-4 w-4 mr-2 text-purple-400 shrink-0" />
              <span className="font-medium text-gray-100">{result.birthTime}</span>
            </div>
          )}
          {result.birthPlace && (
            <div className="flex items-center" title="Nơi sinh">
              <MapPin className="h-4 w-4 mr-2 text-purple-400 shrink-0" />
              <span className="font-medium text-gray-100 truncate" title={result.birthPlace}>{result.birthPlace}</span>
            </div>
          )}
          <div className="flex items-center" title="Thời gian phân tích">
            <Clock className="h-4 w-4 mr-2 text-purple-400 shrink-0" />
            <span className="font-medium text-gray-100">{formatTimestamp(result.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Special case for parse failure with raw JSON */}
      {hasParseFailure ? (
        <div className="p-6 rounded-lg bg-gray-800/90 border border-red-700/50 text-center text-gray-300">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-400" />
          <h3 className="text-xl font-semibold mb-3">Không thể hiển thị đúng định dạng</h3>
          <p className="mb-4">Định dạng dữ liệu trả về không hợp lệ để hiển thị chi tiết.</p>
          {onBackClick && (
            <Button
              variant="outline"
              onClick={onBackClick}
              className="mt-2 border-purple-500 text-purple-300 hover:bg-purple-700/20 hover:text-purple-200"
            >
              Thử lại
            </Button>
          )}
        </div>
      ) : (
        /* Accordion Nội dung */
        parsedSections.length > 0 ? (
          <Accordion type="multiple" defaultValue={['item-0']} /* Mở mục đầu tiên mặc định */ className="w-full space-y-3">
            {parsedSections.map((section, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`