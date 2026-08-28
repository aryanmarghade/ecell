import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PatientInfo } from '../types';
import { DEPARTMENTS, WARDS, PATIENT_CATEGORIES } from '../data/questions';

interface PatientInfoScreenProps {
  initialData: PatientInfo;
  onSubmit: (info: PatientInfo) => void;
  onBack: () => void;
}

export const PatientInfoScreen: React.FC<PatientInfoScreenProps> = ({
  initialData,
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState<PatientInfo>(initialData);
  const [customDept, setCustomDept] = useState('');
  const [customWard, setCustomWard] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation logic
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = 'Full name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Please enter a valid full name';
  }

  const parsedAge = parseInt(formData.age, 10);
  if (!formData.age) {
    errors.age = 'Age is required';
  } else if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
    errors.age = 'Enter a valid age (1-120)';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  const phoneDigits = formData.phone.replace(/[^0-9+]/g, '');
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData.department) {
    errors.department = 'Please select a hospital department';
  } else if (formData.department === 'Other' && !customDept.trim()) {
    errors.department = 'Please specify the department name';
  }

  if (!formData.ward) {
    errors.ward = 'Please select a ward or unit';
  } else if (formData.ward === 'Other' && !customWard.trim()) {
    errors.ward = 'Please specify the ward or unit';
  }

  if (!formData.patientCategory) {
    errors.patientCategory = 'Please select patient category';
  } else if (formData.patientCategory === 'Other' && !customCategory.trim()) {
    errors.patientCategory = 'Please specify category';
  }

  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      age: true,
      email: true,
      phone: true,
      department: true,
      ward: true,
      patientCategory: true,
    });

    if (isValid) {
      const finalDept = formData.department === 'Other' ? customDept.trim() : formData.department;
      const finalWard = formData.ward === 'Other' ? customWard.trim() : formData.ward;
      const finalCategory = formData.patientCategory === 'Other' ? customCategory.trim() : formData.patientCategory;

      onSubmit({
        ...formData,
        department: finalDept,
        ward: finalWard,
        patientCategory: finalCategory,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto px-4 py-4 sm:py-8"
    >
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Form Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            Step 1 of 3
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Patient & Visit Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Please enter your information to begin the feedback questionnaire.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="patient-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="patient-name"
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => handleBlur('name')}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                touched.name && errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Age & Phone in 2-column grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label htmlFor="patient-age" className="block text-xs font-semibold text-slate-700 mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                id="patient-age"
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 42"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                onBlur={() => handleBlur('age')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                  touched.age && errors.age
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
                }`}
              />
              {touched.age && errors.age && (
                <p className="text-xs text-rose-600 mt-1">{errors.age}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="patient-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="patient-phone"
                type="tel"
                placeholder="e.g. (555) 234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                  touched.phone && errors.phone
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="patient-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="patient-email"
              type="email"
              placeholder="e.g. eleanor.vance@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                touched.email && errors.email
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Department & Ward in 2-column grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label htmlFor="patient-department" className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="patient-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  onBlur={() => handleBlur('department')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer pr-8 ${
                    touched.department && errors.department
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
                  }`}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {formData.department === 'Other' && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Specify department..."
                    value={customDept}
                    onChange={(e) => setCustomDept(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              )}

              {touched.department && errors.department && (
                <p className="text-xs text-rose-600 mt-1">{errors.department}</p>
              )}
            </div>

            {/* Ward */}
            <div>
              <label htmlFor="patient-ward" className="block text-xs font-semibold text-slate-700 mb-1">
                Ward / Room / Unit <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="patient-ward"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  onBlur={() => handleBlur('ward')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer pr-8 ${
                    touched.ward && errors.ward
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
                  }`}
                >
                  <option value="">Select Ward or Unit</option>
                  {WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {formData.ward === 'Other' && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Specify ward or unit..."
                    value={customWard}
                    onChange={(e) => setCustomWard(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              )}

              {touched.ward && errors.ward && (
                <p className="text-xs text-rose-600 mt-1">{errors.ward}</p>
              )}
            </div>
          </div>

          {/* Patient Category */}
          <div>
            <label htmlFor="patient-category" className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="patient-category"
                value={formData.patientCategory}
                onChange={(e) => setFormData({ ...formData, patientCategory: e.target.value })}
                onBlur={() => handleBlur('patientCategory')}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer pr-8 ${
                  touched.patientCategory && errors.patientCategory
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600'
                }`}
              >
                <option value="">Select Patient Category</option>
                {PATIENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {formData.patientCategory === 'Other' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Specify patient category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            )}

            {touched.patientCategory && errors.patientCategory && (
              <p className="text-xs text-rose-600 mt-1">{errors.patientCategory}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-5 border-t border-slate-100">
            <button
              id="back-to-welcome-btn"
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="proceed-to-questionnaire-btn"
              type="submit"
              className="w-full sm:flex-1 py-2.5 px-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xs"
            >
              <span>Begin Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

