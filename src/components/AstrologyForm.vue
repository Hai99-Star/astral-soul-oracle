<template>
  <div class="astrology-form-container max-w-2xl mx-auto p-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-xl backdrop-blur-sm">
    <div class="text-center mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v.01M16.732 10l-.001.007-.006.002-.016.004-.02.005-.028.005a6.93 6.93 0 01-.032.005l-.039.005-.039.004a8.003 8.003 0 01-.04.003l-.045.003-.046.002a8.954 8.954 0 01-.048.002l-.048.001h-.002a9.952 9.952 0 01-7.07 0h-.002l-.048-.001a8.954 8.954 0 01-.048-.002l-.046-.002-.045-.003a8.003 8.003 0 01-.04-.003l-.039-.004-.039-.005a6.93 6.93 0 01-.032-.005l-.028-.005-.02-.005-.016-.004-.006-.002L7.268 10M12 16v-.01M7.268 14l.001-.007.006-.002.016-.004.02-.005.028-.005a6.93 6.93 0 01.032-.005l.039-.005.039-.004a8.003 8.003 0 01.04-.003l.045-.003.046-.002a8.954 8.954 0 01.048-.002l.048-.001h.002a9.952 9.952 0 017.07 0h.002l.048.001a8.954 8.954 0 01.048.002l.046.002.045.003a8.003 8.003 0 01.04.003l.039.004.039.005a6.93 6.93 0 01.032.005l.028.005.02.005.016.004.006.002L16.732 14" />
      </svg>
      <h1 class="text-3xl font-bold text-purple-300 mb-2">Tử Vi</h1>
      <p class="text-gray-300">Khám phá lá số tử vi của bạn dựa trên thời gian và địa điểm sinh</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="fullName" class="block mb-2 text-sm font-medium text-purple-200">Họ và Tên đầy đủ</label>
        <input
          type="text"
          id="fullName"
          v-model="formData.fullName"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
          placeholder="Nhập họ và tên đầy đủ của bạn"
          required
        />
      </div>

      <div>
        <label for="birthDate" class="block mb-2 text-sm font-medium text-purple-200">Ngày Tháng Năm Sinh</label>
        <input
          type="text"
          id="birthDate"
          v-model="formData.birthDate"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
          placeholder="DD/MM/YYYY - Ví dụ: 15/08/1990"
          pattern="\d{2}/\d{2}/\d{4}"
          title="Nhập ngày theo định dạng DD/MM/YYYY"
          required
        />
         <p class="mt-1 text-xs text-gray-400">Định dạng: DD/MM/YYYY (ngày/tháng/năm)</p>
      </div>

      <div>
        <label for="birthTime" class="block mb-2 text-sm font-medium text-purple-200">Giờ Sinh (nếu biết)</label>
        <input
          type="text"
          id="birthTime"
          v-model="formData.birthTime"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
          placeholder="HH:MM - Ví dụ: 07:30 hoặc 19:45"
           pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
           title="Nhập giờ theo định dạng HH:MM (24 giờ)"
        />
        <p class="mt-1 text-xs text-gray-400">Định dạng 24 giờ. Không bắt buộc, nhưng giúp phân tích chính xác hơn.</p>
      </div>

      <div>
        <label for="birthPlace" class="block mb-2 text-sm font-medium text-purple-200">Nơi Sinh (nếu biết)</label>
        <input
          type="text"
          id="birthPlace"
          v-model="formData.birthPlace"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
          placeholder="Ví dụ: Hà Nội, Việt Nam"
        />
         <p class="mt-1 text-xs text-gray-400">Không bắt buộc, nhưng giúp phân tích chính xác hơn.</p>
      </div>

      <div class="flex items-center justify-start space-x-3 pt-2">
         <label for="detailedAnalysis" class="flex items-center cursor-pointer">
            <div class="relative">
                 <input
                    type="checkbox"
                    id="detailedAnalysis"
                    v-model="isDetailed"
                    class="sr-only"
                 />
                 <div class="block bg-gray-600 w-10 h-6 rounded-full"></div>
                 <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out"
                      :class="{ 'translate-x-full !bg-purple-400': isDetailed }"></div>
            </div>
            <div class="ml-3 text-sm font-medium text-gray-300">
                Phân tích chi tiết hơn
            </div>
        </label>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Xem Lá Số Tử Vi</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
        </button>
      </div>
    </form>

    <!-- Optional: Display Error Messages -->
    <div v-if="error" class="mt-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-md text-red-200">
        <p><strong>Đã xảy ra lỗi:</strong> {{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { generateAstrologyReading, generateAstrologyDetailedReading } from '@/services/api/astrologyService';
import type { AstrologyFormData, AstrologyResult } from '@/types/astrology';

// Định nghĩa sự kiện emit để gửi kết quả ra component cha
const emit = defineEmits<{
  (e: 'astrologyResult', result: AstrologyResult): void
}>();

// Reactive state cho form data
const formData = reactive<AstrologyFormData>({
  fullName: '',
  birthDate: '',
  birthTime: '', // Khởi tạo là chuỗi rỗng, sẽ được xử lý thành undefined nếu cần
  birthPlace: '', // Khởi tạo là chuỗi rỗng
});

// State cho checkbox phân tích chi tiết
const isDetailed = ref(false);

// State cho trạng thái loading và lỗi
const isLoading = ref(false);
const error = ref<string | null>(null);

// Hàm xử lý khi submit form
const handleSubmit = async () => {
  isLoading.value = true;
  error.value = null; // Reset lỗi trước khi gọi API

  // Chuẩn bị dữ liệu: chuyển chuỗi rỗng thành undefined cho các trường tùy chọn nếu hàm backend yêu cầu
  const name = formData.fullName;
  const birthDate = formData.birthDate;
  // Nếu giá trị là chuỗi rỗng, coi như không có, gửi undefined. Nếu không, gửi giá trị.
  const birthTime = formData.birthTime?.trim() ? formData.birthTime.trim() : undefined;
  const birthPlace = formData.birthPlace?.trim() ? formData.birthPlace.trim() : undefined;


  try {
    let readingResult: string;
    const startTime = Date.now();

    if (isDetailed.value) {
      console.log('Calling generateAstrologyDetailedReading with:', { name, birthDate, birthTime, birthPlace });
      readingResult = await generateAstrologyDetailedReading(name, birthDate, birthTime, birthPlace);
    } else {
      console.log('Calling generateAstrologyReading with:', { name, birthDate, birthTime, birthPlace });
      readingResult = await generateAstrologyReading(name, birthDate, birthTime, birthPlace);
    }

    const result: AstrologyResult = {
      name: name,
      birthDate: birthDate,
      birthTime: birthTime, // Lưu giá trị đã xử lý (có thể là undefined)
      birthPlace: birthPlace, // Lưu giá trị đã xử lý (có thể là undefined)
      reading: readingResult,
      timestamp: startTime, // Hoặc Date.now() nếu muốn thời điểm hoàn thành
      isDetailed: isDetailed.value,
    };

    // Gửi kết quả ra component cha
    emit('astrologyResult', result);

    // Optional: Reset form sau khi thành công
    // formData.fullName = '';
    // formData.birthDate = '';
    // formData.birthTime = '';
    // formData.birthPlace = '';
    // isDetailed.value = false;

  } catch (err: any) {
    console.error("Error generating astrology reading:", err);
    // Cố gắng hiển thị thông báo lỗi thân thiện hơn
    error.value = err.message || "Không thể tạo phân tích tử vi. Vui lòng thử lại.";
    // Optional: Emit lỗi ra component cha nếu cần
    // emit('astrologyError', error.value);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Thêm CSS cho toggle switch nếu muốn tùy chỉnh ngoài Tailwind */
.dot {
  transform: translateX(0);
}
input:checked ~ .dot {
  transform: translateX(100%); /* Tailwind's translate-x-full tương đương */
}

/* Nếu không dùng Tailwind, bạn cần định nghĩa các lớp màu, khoảng cách, font... ở đây */
.astrology-form-container {
  /* Ví dụ CSS thuần nếu không dùng Tailwind */
  /* background-color: rgba(31, 41, 55, 0.8); /* Tương đương bg-gray-800 bg-opacity-80 */
  /* backdrop-filter: blur(4px); */
  /* padding: 2rem; */
  /* border-radius: 0.5rem; */
  /* color: #d1d5db; /* text-gray-300 */ */
}
/* ... các style khác ... */
</style> 