'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers';
import { db } from '@/configs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { IoAddCircle } from 'react-icons/io5';
import Navbar from '@/components/navbar';
import { toast } from 'react-fox-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Select from 'react-select';
import './profile.css'; // Optional: For custom styles

// Types
interface AcademicRecord {
    id: string;
    institution: string;
    degreeType: string;
    fieldOfStudy: string;
    years: { from: string; to: string };
    currentStudy?: boolean;
    currentSemesterGrade?: string;
}

interface GeneralInfo {
    name?: string;
    email?: string;
    dob?: string;
    gender?: string;
    state?: string;
    city?: string;
    pincode?: string;
}

interface JobInfo {
    id: string;
    company?: string;
    designation?: string;
    employmentType?: string;
    location?: string;
    locationType?: string;
    currentEmployee?: boolean;
    period?: { from: string; to: string };
}

interface UserProfile {
    generalInfo: GeneralInfo;
    academicInfo: AcademicRecord[];
    jobInfo: JobInfo[];
}

interface GeneralFormData extends GeneralInfo { }
interface AcademicFormData extends Omit<AcademicRecord, 'id'> {
    id?: string;
}
interface JobFormData extends Omit<JobInfo, 'id'> {
    id?: string;
}

type tabPagesType = 'account' | 'education' | 'professional';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<tabPagesType>('account');
    const [profile, setProfile] = useState<UserProfile>({
        generalInfo: {},
        academicInfo: [],
        jobInfo: [],
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isEditingAcademicInfo, setIsEditingAcademicInfo] = useState(false);
    const [isEditingJobInfo, setIsEditingJobInfo] = useState(false);
    const [generalFormData, setGeneralFormData] = useState<GeneralFormData>({});
    const [academicFormData, setAcademicFormData] = useState<AcademicFormData>({
        institution: '',
        degreeType: '',
        fieldOfStudy: '',
        years: { from: '', to: '' },
        currentStudy: false,
        currentSemesterGrade: '',
    });
    const [jobFormData, setJobFormData] = useState<JobFormData>({
        company: '',
        designation: '',
        employmentType: '',
        location: '',
        locationType: '',
        currentEmployee: false,
        period: { from: '', to: '' },
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Dropdown options
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];
    const stateOptions = [
        { value: 'odisha', label: 'Odisha' },
        { value: 'maharashtra', label: 'Maharashtra' },
        { value: 'karnataka', label: 'Karnataka' },
        { value: 'tamil_nadu', label: 'Tamil Nadu' },
    ];

    const cityOptions = [
        { value: 'bhubaneshwar', label: 'Bhubaneshwar' },
        { value: 'pune', label: 'Pune' },
        { value: 'bangalore', label: 'Bangalore' },
        { value: 'chennai', label: 'Chennai' },
    ];

    const employmentTypeOptions = [
        { value: 'government_research', label: 'Government Research' },
        { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
        { value: 'biotech_startup', label: 'Biotech Startup' },
        { value: 'academic_research', label: 'Academic Research' },
    ];

    const locationTypeOptions = [
        { value: 'urban', label: 'Urban' },
        { value: 'semi_urban', label: 'Semi-Urban' },
        { value: 'rural', label: 'Rural' },
    ];

    const degreeTypeOptions = [
        { value: 'bsc_biology', label: 'B.Sc. Biology' },
        { value: 'msc_biotechnology', label: 'M.Sc. Biotechnology' },
        { value: 'phd_molecular_biology', label: 'Ph.D. Molecular Biology' },
    ];

    const semesterGradeOptions = [
        { value: 'first_class', label: 'First Class' },
        { value: 'distinction', label: 'Distinction' },
        { value: 'second_class', label: 'Second Class' },
    ];

    useEffect(() => {

        if (loading) {
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                if (user) {
                    const docRef = doc(db, 'profiles', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserProfile;
                        setProfile(data);
                    }
                }
            } catch (error) {
                toast.error('Failed to fetch profile data');
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [user, loading]);

    const validateGeneralInfo = (data: GeneralFormData): string | null => {
        if (!data.name || !data.email || !data.dob || !data.gender) {
            return 'Name, Email, DOB, and Gender are mandatory';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return 'Invalid email format';
        }
        return null;
    };

    const validateAcademicInfo = (data: AcademicFormData): string | null => {
        if (!data.institution || !data.degreeType || !data.fieldOfStudy || !data.years.from || !data.years.to) {
            if (!data.years.to && !data.currentStudy)
                return 'All fields are mandatory';
        }

        return null;
    };

    const validateJobInfo = (data: JobFormData): string | null => {
        if (!data.company || !data.designation || !data.period?.from || !data.period?.to) {
            if (!data.period?.to && !data.currentEmployee)
                return 'Company, Designation, and Period are mandatory';
        }

        return null;
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setIsEditing(false);
            setGeneralFormData({});
        } else {
            setIsEditing(true);
            setGeneralFormData({ ...profile.generalInfo });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (activeTab === 'account') {
            setGeneralFormData((prev) => ({ ...prev, [name]: value }));
        } else if (activeTab === 'education') {
            if (name === 'from' || name === 'to') {
                setAcademicFormData((prev) => ({
                    ...prev,
                    years: { ...prev.years, [name]: value },
                }));
            } else {
                setAcademicFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else if (activeTab === 'professional') {
            if (name === 'from' || name === 'to') {
                setJobFormData((prev) => ({
                    ...prev,
                    period: { ...(prev.period || { from: '', to: '' }), [name]: value },
                }));
            } else {
                setJobFormData((prev) => ({ ...prev, [name]: value }));
            }
        }
    };

    const handleSelectChange = (name: string, selectedOption: any) => {
        if (activeTab === 'account') {
            setGeneralFormData((prev) => ({ ...prev, [name]: selectedOption?.value }));
        } else if (activeTab === 'education') {
            setAcademicFormData((prev) => ({ ...prev, [name]: selectedOption?.value }));
        } else if (activeTab === 'professional') {
            setJobFormData((prev) => ({ ...prev, [name]: selectedOption?.value }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeTab === 'education') {
            setAcademicFormData((prev) => ({ ...prev, currentStudy: e.target.checked }));
        }

        if (activeTab === "professional") {
            setJobFormData((prev) => ({ ...prev, currentEmployee: e.target.checked }))
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (user) {
                if (activeTab === 'account') {
                    const validationError = validateGeneralInfo(generalFormData);
                    if (validationError) {
                        toast.error(validationError);
                        return;
                    }
                    const updatedProfile = { ...profile, generalInfo: generalFormData };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile, { merge: true });
                    setProfile(updatedProfile);
                    setIsEditing(false);
                    setGeneralFormData({});
                    toast.success('Account info updated successfully');
                } else if (activeTab === 'education') {
                    const validationError = validateAcademicInfo(academicFormData);
                    if (validationError) {
                        toast.error(validationError);
                        return;
                    }
                    const newRecord = { ...academicFormData, id: Date.now().toString() } as AcademicRecord;
                    let updatedAcademicInfo = [...profile.academicInfo];
                    if (editingIndex !== null) {
                        updatedAcademicInfo[editingIndex] = newRecord;
                        toast.success('Education record updated successfully');
                    } else {
                        updatedAcademicInfo.push(newRecord);
                        toast.success('Education record added successfully');
                    }
                    const updatedProfile = { ...profile, academicInfo: updatedAcademicInfo };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile, { merge: true });
                    setProfile(updatedProfile);
                    setIsEditingAcademicInfo(false);
                    setAcademicFormData({
                        institution: '',
                        degreeType: '',
                        fieldOfStudy: '',
                        years: { from: '', to: '' },
                        currentStudy: false,
                        currentSemesterGrade: '',
                    });
                    setEditingIndex(null);
                } else if (activeTab === 'professional') {
                    const validationError = validateJobInfo(jobFormData);
                    if (validationError) {
                        toast.error(validationError);
                        return;
                    }
                    const newRecord = { ...jobFormData, id: Date.now().toString() } as JobInfo;
                    let updatedJobInfo = [...profile.jobInfo];
                    if (editingIndex !== null) {
                        updatedJobInfo[editingIndex] = newRecord;
                        toast.success('Professional record updated successfully');
                    } else {
                        updatedJobInfo.push(newRecord);
                        toast.success('Professional record added successfully');
                    }
                    const updatedProfile = { ...profile, jobInfo: updatedJobInfo };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile, { merge: true });
                    setProfile(updatedProfile);
                    setIsEditingJobInfo(false);
                    setJobFormData({
                        company: '',
                        designation: '',
                        employmentType: '',
                        location: '',
                        locationType: '',
                        period: { from: '', to: '' },
                    });
                    setEditingIndex(null);
                }
            }
        } catch (error) {
            toast.error('Failed to save data');
            console.error('Save error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRecord = (index: number) => {
        if (activeTab === 'education') {
            setAcademicFormData({ ...profile.academicInfo[index] });
            setIsEditingAcademicInfo(true);
        } else if (activeTab === 'professional') {
            setJobFormData({ ...profile.jobInfo[index] });
            setIsEditingJobInfo(true);
        }
        setEditingIndex(index);
    };

    const handleDeleteRecord = async (index: number) => {
        setIsLoading(true);
        try {
            if (user) {
                let updatedData;
                if (activeTab === 'education') {
                    updatedData = profile.academicInfo.filter((_, i) => i !== index);
                    const updatedProfile = { ...profile, academicInfo: updatedData };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile, { merge: true });
                    setProfile(updatedProfile);
                    toast.success('Education record deleted successfully');
                } else if (activeTab === 'professional') {
                    updatedData = profile.jobInfo.filter((_, i) => i !== index);
                    const updatedProfile = { ...profile, jobInfo: updatedData };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile, { merge: true });
                    setProfile(updatedProfile);
                    toast.success('Professional record deleted successfully');
                }
            }
        } catch (error) {
            toast.error('Failed to delete record');
            console.error('Delete error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar title="My Profile" showDropdown={false} />
            <div className="max-w-md mx-auto p-4">
                {isLoading && (
                    <div className="flex justify-center items-center h-64 animate-spin">
                        <AiOutlineLoading3Quarters color="#0B7DBF" size={30} />
                    </div>
                )}
                {!isLoading && (
                    <>
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col items-center relative border border-gray-200">
                            <FaUserCircle size={80} className="text-gray-400" />
                            <h2 className="text-xl font-bold mt-2 text-[#2973B2F2]">{user?.displayName || 'Indranil'}</h2>
                            <p className="text-[#2973B2F2] text-sm">BioCAN ID - {user?.uid?.slice(0, 8)?.toUpperCase() || 'ABNH8283'}</p>
                            {
                                activeTab === 'account' && <button
                                    onClick={handleEditToggle}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                                    aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
                                >
                                    <FaEdit size={16} />
                                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                                </button>
                            }

                        </div>

                        <div className="flex border-b mb-4 justify-around text-sm font-medium">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`px-4 py-2 hover:cursor-pointer ${activeTab === 'account' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                aria-selected={activeTab === 'account'}
                            >
                                Account
                            </button>
                            <button
                                onClick={() => setActiveTab('education')}
                                className={`px-4 py-2 hover:cursor-pointer ${activeTab === 'education' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                aria-selected={activeTab === 'education'}
                            >
                                Education
                            </button>
                            <button
                                onClick={() => setActiveTab('professional')}
                                className={`px-4 py-2 hover:cursor-pointer ${activeTab === 'professional' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                aria-selected={activeTab === 'professional'}
                            >
                                Professional
                            </button>
                        </div>

                        {activeTab === 'account' && (
                            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={generalFormData.name || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">E mail address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={generalFormData.email || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={generalFormData.dob || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Gender</label>
                                            <Select
                                                name="gender"
                                                value={genderOptions.find(option => option.value === generalFormData.gender) || null}
                                                onChange={(selectedOption) => handleSelectChange('gender', selectedOption)}
                                                options={genderOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">State</label>
                                            <Select
                                                name="state"
                                                value={stateOptions.find(option => option.value === generalFormData.state) || null}
                                                onChange={(selectedOption) => handleSelectChange('state', selectedOption)}
                                                options={stateOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">City</label>
                                            <Select
                                                name="city"
                                                value={cityOptions.find(option => option.value === generalFormData.city) || null}
                                                onChange={(selectedOption) => handleSelectChange('city', selectedOption)}
                                                options={cityOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={generalFormData.pincode || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={handleEditToggle}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-700 font-medium">Name</p>
                                            <p className="text-gray-900">{profile.generalInfo.name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">E mail address</p>
                                            <p className="text-gray-900">{profile.generalInfo.email || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">Date of Birth</p>
                                            <p className="text-gray-900">{profile.generalInfo.dob || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">Gender</p>
                                            <p className="text-gray-900">{profile.generalInfo.gender || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">State</p>
                                            <p className="text-gray-900">{profile.generalInfo.state || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">City</p>
                                            <p className="text-gray-900">{profile.generalInfo.city || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium">Pincode</p>
                                            <p className="text-gray-900">{profile.generalInfo.pincode || '-'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'education' && (
                            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                {isEditingAcademicInfo ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium">Name</label>
                                            <input
                                                type="text"
                                                name="institution"
                                                value={academicFormData.institution}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Degree Type</label>
                                            <Select
                                                name="degreeType"
                                                value={degreeTypeOptions.find(option => option.value === academicFormData.degreeType) || null}
                                                onChange={(selectedOption) => handleSelectChange('degreeType', selectedOption)}
                                                options={degreeTypeOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Field of Study</label>
                                            <input
                                                type="text"
                                                name="fieldOfStudy"
                                                value={academicFormData.fieldOfStudy}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Start Date</label>
                                            <input
                                                type="date"
                                                name="from"
                                                value={academicFormData.years.from}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">
                                                <input
                                                    type="checkbox"
                                                    name="currentStudy"
                                                    checked={academicFormData.currentStudy || false}
                                                    onChange={handleCheckboxChange}
                                                    className="mr-2"
                                                />
                                                I am currently studying in this institution
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Current Semester / Grade</label>
                                            <Select
                                                name="currentSemesterGrade"
                                                value={semesterGradeOptions.find(option => option.value === academicFormData.currentSemesterGrade) || null}
                                                onChange={(selectedOption) => handleSelectChange('currentSemesterGrade', selectedOption)}
                                                options={semesterGradeOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                                isDisabled={!academicFormData.currentStudy}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">End Date</label>
                                            <input
                                                type="date"
                                                name="to"
                                                value={academicFormData.years.to}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                                disabled={academicFormData.currentStudy}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setIsEditingAcademicInfo(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                {editingIndex !== null ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {profile.academicInfo.map((record, index) => (
                                            <div key={record.id} className="bg-gray-50 p-4 rounded-lg mb-2 flex justify-between items-center border border-gray-200">
                                                <div>
                                                    <p className="text-gray-700"><strong>Name:</strong> {record.institution}</p>
                                                    <p className="text-gray-900">{record.institution}</p>
                                                    <p className="text-gray-700"><strong>Degree Type:</strong> {record.degreeType}</p>
                                                    <p className="text-gray-900">{record.degreeType}</p>
                                                    <p className="text-gray-700"><strong>Field of Study:</strong> {record.fieldOfStudy}</p>
                                                    <p className="text-gray-900">{record.fieldOfStudy}</p>
                                                    <p className="text-gray-700"><strong>Start Date:</strong> {record.years.from}</p>
                                                    <p className="text-gray-900">{record.years.from}</p>
                                                    {record.currentStudy ? (
                                                        <p className="text-gray-700"><strong>Current Semester / Grade:</strong> {record.currentSemesterGrade}</p>
                                                    ) : (
                                                        <p className="text-gray-700"><strong>End Date:</strong> {record.years.to}</p>
                                                    )}
                                                    <p className="text-gray-900">{record.currentStudy ? record.currentSemesterGrade : record.years.to}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteRecord(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setIsEditingAcademicInfo(true)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2"
                                        >
                                            <IoAddCircle size={20} />
                                            <span className="text-gray-700">Add Education Record</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                {isEditingJobInfo ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium">Company or Organization</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={jobFormData.company || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Designation</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={jobFormData.designation || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Employment Type</label>
                                            <Select
                                                name="employmentType"
                                                value={employmentTypeOptions.find(option => option.value === jobFormData.employmentType) || null}
                                                onChange={(selectedOption) => handleSelectChange('employmentType', selectedOption)}
                                                options={employmentTypeOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Location</label>
                                            <Select
                                                name="location"
                                                value={locationTypeOptions.find(option => option.value === jobFormData.location) || null}
                                                onChange={(selectedOption) => handleSelectChange('location', selectedOption)}
                                                options={locationTypeOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Location Type</label>
                                            <Select
                                                name="locationType"
                                                value={locationTypeOptions.find(option => option.value === jobFormData.locationType) || null}
                                                onChange={(selectedOption) => handleSelectChange('locationType', selectedOption)}
                                                options={locationTypeOptions}
                                                className="w-full text-gray-900 bg-gray-50"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">Start Date</label>
                                            <input
                                                type="date"
                                                name="from"
                                                value={jobFormData.period?.from || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">
                                                <input
                                                    type="checkbox"
                                                    name="currentEmployee"
                                                    checked={jobFormData.currentEmployee || false}
                                                    onChange={handleCheckboxChange}
                                                    className="mr-2"
                                                />
                                                I am currently employed here
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium">End Date</label>
                                            <input
                                                type="date"
                                                name="to"
                                                value={jobFormData.period?.to || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded text-gray-900 bg-gray-50"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setIsEditingJobInfo(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                {editingIndex !== null ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {profile.jobInfo.map((record, index) => (
                                            <div key={record.id} className="bg-gray-50 p-4 rounded-lg mb-2 flex justify-between items-center border border-gray-200">
                                                <div>
                                                    <p className="text-gray-700"><strong>Company or Organization:</strong> {record.company}</p>
                                                    <p className="text-gray-900">{record.company}</p>
                                                    <p className="text-gray-700"><strong>Designation:</strong> {record.designation}</p>
                                                    <p className="text-gray-900">{record.designation}</p>
                                                    <p className="text-gray-700"><strong>Employment Type:</strong> {record.employmentType}</p>
                                                    <p className="text-gray-900">{record.employmentType}</p>
                                                    <p className="text-gray-700"><strong>Location:</strong> {record.location}</p>
                                                    <p className="text-gray-900">{record.location}</p>
                                                    <p className="text-gray-700"><strong>Location Type:</strong> {record.locationType}</p>
                                                    <p className="text-gray-900">{record.locationType}</p>
                                                    <p className="text-gray-700"><strong>Start Date:</strong> {record.period?.from}</p>
                                                    <p className="text-gray-900">{record.period?.from}</p>
                                                    <p className="text-gray-700"><strong>End Date:</strong> {record.period?.to}</p>
                                                    <p className="text-gray-900">{record.period?.to}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteRecord(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setIsEditingJobInfo(true)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2"
                                        >
                                            <IoAddCircle size={20} />
                                            <span className="text-gray-700">Add Professional Record</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;