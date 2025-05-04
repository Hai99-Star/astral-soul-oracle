import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; 
import { Switch } from '@/components/ui/switch';   
import { Label } from '@/components/ui/label';     
import { Input } from '@/components/ui/input';     
import type { AstrologyFormData } from '@/types/astrology';

interface AstrologyFormProps {
    initialData?: Partial<AstrologyFormData>;
    isLoading: boolean;
    onSubmit: (formData: AstrologyFormData, isDetailed: boolean) => Promise<void>;
}

const AstrologyForm: React.FC<AstrologyFormProps> = ({ initialData = {}, isLoading, onSubmit }) => {
    const [formData, setFormData] = useState<AstrologyFormData>({
        fullName: initialData.fullName || '',
        birthDate: initialData.birthDate || '',
        birthTime: initialData.birthTime || '',
        birthPlace: initialData.birthPlace || '',
    });
    const [isDetailed, setIsDetailed] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailedChange = (checked: boolean) => {
        setIsDetailed(checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Chuẩn bị dữ liệu: loại bỏ chuỗi rỗng nếu cần (tuỳ thuộc API backend)
        const submitData: AstrologyFormData = {
            ...formData,
            // Nếu API service xử lý undefined tốt hơn chuỗi rỗng
            // birthTime: formData.birthTime?.trim() || undefined,
            // birthPlace: formData.birthPlace?.trim() || undefined,
        };
        onSubmit(submitData, isDetailed);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            {/* Họ và Tên */}
            <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                    Họ và Tên đầy đủ
                </Label>
                <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="mystical-input" // Giữ lại class nếu bạn có định nghĩa CSS riêng
                    placeholder="Nhập họ và tên đầy đủ của bạn"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Ngày Sinh */}
            <div>
                <Label htmlFor="birthDate" className="block text-sm font-medium text-foreground mb-1">
                    Ngày Tháng Năm Sinh
                </Label>
                <Input
                    type="text"
                    id="birthDate"
                    name="birthDate"
                    className="mystical-input"
                    placeholder="DD/MM/YYYY - Ví dụ: 15/08/1990"
                    pattern="\d{2}/\d{2}/\d{4}"
                    title="Nhập ngày theo định dạng DD/MM/YYYY"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">Định dạng: DD/MM/YYYY (ngày/tháng/năm)</p>
            </div>

            {/* Giờ Sinh */}
            <div>
                <Label htmlFor="birthTime" className="block text-sm font-medium text-foreground mb-1">
                    Giờ Sinh (nếu biết)
                </Label>
                <Input
                    type="text"
                    id="birthTime"
                    name="birthTime"
                    className="mystical-input"
                    placeholder="HH:MM - Ví dụ: 07:30 hoặc 19:45"
                    pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    title="Nhập giờ theo định dạng HH:MM (24 giờ)"
                    value={formData.birthTime}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">Định dạng 24 giờ. Không bắt buộc, nhưng giúp phân tích chính xác hơn.</p>
            </div>

            {/* Nơi Sinh */}
            <div>
                <Label htmlFor="birthPlace" className="block text-sm font-medium text-foreground mb-1">
                    Nơi Sinh (nếu biết)
                </Label>
                <Input
                    type="text"
                    id="birthPlace"
                    name="birthPlace"
                    className="mystical-input"
                    placeholder="Ví dụ: Hà Nội, Việt Nam"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">Không bắt buộc, nhưng giúp phân tích chính xác hơn.</p>
            </div>

            {/* Phân tích chi tiết */}
            <div className="flex items-center space-x-2 my-4">
                <Switch
                    id="detailed-reading"
                    checked={isDetailed}
                    onCheckedChange={handleDetailedChange}
                    disabled={isLoading}
                />
                <Label htmlFor="detailed-reading" className="cursor-pointer">
                    Phân tích chi tiết hơn
                </Label>
            </div>

            {/* Nút Submit */}
            <div className="flex justify-center mt-6">
                <Button
                    type="submit"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-medium px-8" // Sử dụng class từ ShadCN/UI hoặc Tailwind
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="mr-2">Đang phân tích...</span>
                            <div className="h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full animate-spin"></div>
                        </>
                    ) : (
                        'Xem Lá Số Tử Vi'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default AstrologyForm; 