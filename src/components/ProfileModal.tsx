import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Ruler,
  Weight,
  Palette,
  Heart,
  Save,
  Check,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { UserProfile } from '../data/mockProducts';

const SKIN_TONES = [
  { label: 'Trắng sáng', hex: '#FDEBD0' },
  { label: 'Trắng hồng', hex: '#F5CBA7' },
  { label: 'Sáng vàng', hex: '#F0D9A0' },
  { label: 'Trung bình', hex: '#D4A574' },
  { label: 'Ngăm vàng', hex: '#C68642' },
  { label: 'Ngăm đen', hex: '#8D5524' },
  { label: 'Nâu đậm', hex: '#6B3A20' },
];

const BODY_TYPES = [
  { label: 'Đồng hồ cát', desc: 'Vai và hông cân đối, eo thon' },
  { label: 'Chữ nhật', desc: 'Vai, eo, hông tương đương' },
  { label: 'Quả lê', desc: 'Hông rộng hơn vai' },
  { label: 'Tam giác ngược', desc: 'Vai rộng hơn hông' },
  { label: 'Quả táo', desc: 'Phần eo rộng nhất' },
  { label: 'Mảnh mai', desc: 'Thon gọn, ít đường cong' },
  { label: 'Tròn đầy', desc: 'Đường cong đầy đặn' },
];

const STYLE_PREFS = [
  'Tối giản', 'Sang trọng', 'Streetwear', 'Bohemian',
  'Nữ tính', 'Vintage', 'Thể thao', 'Cổ điển',
  'Hiện đại', 'Casual', 'Thanh lịch', 'Phóng khoáng',
];

export default function ProfileModal() {
  const { userProfile, setUserProfile, isProfileOpen, toggleProfile } = useAppStore();
  const [form, setForm] = useState<UserProfile>(userProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(userProfile);
  }, [userProfile, isProfileOpen]);

  const update = (key: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setUserProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    const empty: UserProfile = {
      gender: '', height: '', weight: '',
      bust: '', waist: '', hip: '',
      skinTone: '', bodyType: '', stylePreference: '', notes: '',
    };
    setForm(empty);
    setUserProfile(empty);
  };

  const hasData = Object.values(form).some((v) => v.trim() !== '');

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleProfile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-[#222] z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#222] p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white font-['Space_Grotesk']">Hồ sơ cá nhân</h2>
                  <p className="text-[10px] text-[#555] font-['Space_Grotesk']">AI sẽ tư vấn dựa trên thông tin này</p>
                </div>
              </div>
              <button
                onClick={toggleProfile}
                className="w-8 h-8 rounded-lg hover:bg-[#222] flex items-center justify-center text-[#555] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Gender */}
              <div>
                <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 block">Giới tính</label>
                <div className="flex gap-2">
                  {['Nam', 'Nữ', 'Khác'].map((g) => (
                    <button
                      key={g}
                      onClick={() => update('gender', form.gender === g ? '' : g)}
                      className={`flex-1 text-xs font-['Space_Grotesk'] py-2.5 rounded-xl border transition-all ${
                        form.gender === g
                          ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]'
                          : 'bg-[#111] border-[#222] text-[#888] hover:border-[#C9A84C]/30'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 flex items-center gap-1.5">
                    <Ruler className="w-3 h-3" /> Chiều cao (cm)
                  </label>
                  <input
                    type="text"
                    value={form.height}
                    onChange={(e) => update('height', e.target.value)}
                    placeholder="165"
                    className="w-full bg-[#111] border border-[#222] focus:border-[#C9A84C]/50 text-white text-sm font-['Space_Grotesk'] px-3 py-2.5 rounded-xl outline-none transition-colors placeholder:text-[#333]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 flex items-center gap-1.5">
                    <Weight className="w-3 h-3" /> Cân nặng (kg)
                  </label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) => update('weight', e.target.value)}
                    placeholder="55"
                    className="w-full bg-[#111] border border-[#222] focus:border-[#C9A84C]/50 text-white text-sm font-['Space_Grotesk'] px-3 py-2.5 rounded-xl outline-none transition-colors placeholder:text-[#333]"
                  />
                </div>
              </div>

              {/* Three measurements */}
              <div>
                <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 block">Số đo 3 vòng (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-[#555] font-['Space_Grotesk'] block mb-1">Vòng 1</span>
                    <input
                      type="text"
                      value={form.bust}
                      onChange={(e) => update('bust', e.target.value)}
                      placeholder="86"
                      className="w-full bg-[#111] border border-[#222] focus:border-[#C9A84C]/50 text-white text-sm font-['Space_Grotesk'] px-3 py-2 rounded-lg outline-none transition-colors placeholder:text-[#333]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555] font-['Space_Grotesk'] block mb-1">Vòng 2</span>
                    <input
                      type="text"
                      value={form.waist}
                      onChange={(e) => update('waist', e.target.value)}
                      placeholder="64"
                      className="w-full bg-[#111] border border-[#222] focus:border-[#C9A84C]/50 text-white text-sm font-['Space_Grotesk'] px-3 py-2 rounded-lg outline-none transition-colors placeholder:text-[#333]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555] font-['Space_Grotesk'] block mb-1">Vòng 3</span>
                    <input
                      type="text"
                      value={form.hip}
                      onChange={(e) => update('hip', e.target.value)}
                      placeholder="92"
                      className="w-full bg-[#111] border border-[#222] focus:border-[#C9A84C]/50 text-white text-sm font-['Space_Grotesk'] px-3 py-2 rounded-lg outline-none transition-colors placeholder:text-[#333]"
                    />
                  </div>
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> Tông da
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.label}
                      onClick={() => update('skinTone', form.skinTone === tone.label ? '' : tone.label)}
                      className={`flex items-center gap-1.5 text-[11px] font-['Space_Grotesk'] px-2.5 py-1.5 rounded-lg border transition-all ${
                        form.skinTone === tone.label
                          ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]'
                          : 'bg-[#111] border-[#222] text-[#888] hover:border-[#C9A84C]/30'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: tone.hex }} />
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 block">Dáng người</label>
                <div className="grid grid-cols-2 gap-2">
                  {BODY_TYPES.map((bt) => (
                    <button
                      key={bt.label}
                      onClick={() => update('bodyType', form.bodyType === bt.label ? '' : bt.label)}
                      className={`text-left px-3 py-2 rounded-xl border transition-all ${
                        form.bodyType === bt.label
                          ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50'
                          : 'bg-[#111] border-[#222] hover:border-[#C9A84C]/30'
                      }`}
                    >
                      <span className={`text-xs font-['Space_Grotesk'] font-medium ${
                        form.bodyType === bt.label ? 'text-[#C9A84C]' : 'text-white'
                      }`}>{bt.label}</span>
                      <p className="text-[10px] text-[#555] font-['Space_Grotesk'] mt-0.5">{bt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Preference */}
              <div>
                <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 flex items-center gap-1.5">
                  <Heart className="w-3 h-3" /> Phong cách yêu thích
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_PREFS.map((style) => {
                    const isSelected = form.stylePreference.split(', ').includes(style);
                    return (
                      <button
                        key={style}
                        onClick={() => {
                          const current = form.stylePreference.split(', ').filter(Boolean);
                          const updated = isSelected
                            ? current.filter((s) => s !== style)
                            : [...current, style];
                          update('stylePreference', updated.join(', '));
                        }}
                        className={`text-[11px] font-['Space_Grotesk'] px-2.5 py-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]'
                            : 'bg-[#111] border-[#222] text-[#888] hover:border-[#C9A84C]/30'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-[#888] font-['Space_Grotesk'] mb-2 block">Ghi chú thêm</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Ví dụ: dị ứng len, thích tone trầm, hay đi giày cao gót..."
                  rows={3}
                  className="w-full bg-[#111] border border-[#222] focus:border-[#C9A84C]/50 text-white text-xs font-['Space_Grotesk'] px-3 py-2.5 rounded-xl outline-none transition-colors placeholder:text-[#333] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-black text-xs font-['Space_Grotesk'] font-medium py-3 rounded-xl transition-all"
                >
                  {saved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Đã lưu!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Lưu hồ sơ
                    </>
                  )}
                </button>
                {hasData && (
                  <button
                    onClick={handleClear}
                    className="flex items-center justify-center gap-1.5 text-[#555] hover:text-red-400 text-xs font-['Space_Grotesk'] border border-[#222] hover:border-red-400/30 px-4 py-3 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa
                  </button>
                )}
              </div>

              {/* Note */}
              <p className="text-[10px] text-[#444] font-['Space_Grotesk'] text-center leading-relaxed">
                Thông tin được lưu trên trình duyệt của bạn và chỉ dùng để AI tư vấn chính xác hơn. Không gửi đến bên thứ ba.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
