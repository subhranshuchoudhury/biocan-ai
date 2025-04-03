// pages/profile.tsx
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

// Types
interface AcademicRecord {
    id: string;
    institution: string;
    degreeType: string;
    fieldOfStudy: string;
    years: { from: string; to: string };
}

interface GeneralInfo {
    mobile?: string;
    email?: string;
    dob?: string;
    gender?: string;
    state?: string;
    city?: string;
    pincode?: string;
}

interface JobInfo {
    id: string;
    currentJob?: string;
    company?: string;
    period?: { from: string; to: string };
    employmentType?: string;
    location?: string;
    type?: string;
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

type tabPagesType = 'general' | 'academic' | 'job';

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<tabPagesType>('general');
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
    });
    const [jobFormData, setJobFormData] = useState<JobFormData>({
        currentJob: '',
        company: '',
        period: { from: '', to: '' },
        employmentType: '',
        location: '',
        type: '',
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // const clearJobInfoData = async () => {
    //     setIsLoading(true);
    //     try {
    //         if (user) {
    //             const updatedProfile = { ...profile, jobInfo: [] };
    //             await setDoc(doc(db, 'profiles', user.uid), updatedProfile);
    //             setProfile(updatedProfile);
    //             toast.success('All job info data cleared successfully');
    //         }
    //     } catch (error) {
    //         toast.error('Failed to clear job info data');
    //         console.error('Clear job info error:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {

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
    }, [user]);

    const validateGeneralInfo = (data: GeneralFormData): string | null => {
        if (!data.mobile || !data.email || !data.dob || !data.gender || !data.state || !data.city || !data.pincode) {
            return 'All fields are mandatory';
        }
        return null;
    };

    const validateAcademicInfo = (data: AcademicFormData): string | null => {
        if (!data.institution || !data.degreeType || !data.fieldOfStudy || !data.years.from || !data.years.to) {
            return 'All fields are mandatory';
        }
        if (!/^\d{4}$/.test(data.years.from) || !/^\d{4}$/.test(data.years.to)) {
            return 'Years must be valid 4-digit years';
        }
        return null;
    };

    const validateJobInfo = (data: JobFormData): string | null => {
        if (!data.currentJob || !data.company || !data.period?.from || !data.period?.to) {
            return 'Current Job, Company, and Period are mandatory';
        }
        if (!/^\d{4}$/.test(data.period.from) || !/^\d{4}$/.test(data.period.to)) {
            return 'Years must be valid 4-digit years';
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
        if (activeTab === 'general') {
            setGeneralFormData((prev) => ({ ...prev, [name]: value }));
        } else if (activeTab === 'academic') {
            if (name === 'from' || name === 'to') {
                setAcademicFormData((prev) => ({
                    ...prev,
                    years: { ...prev.years, [name]: value },
                }));
            } else {
                setAcademicFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else if (activeTab === 'job') {
            if (name === 'from' || name === 'to' || name === 'currentJob' || name === 'company' || name === 'employmentType' || name === 'location' || name === 'type') {
                if (name === 'from' || name === 'to') {
                    setJobFormData((prev) => ({
                        ...prev,
                        period: { ...(prev.period || { from: '', to: '' }), [name]: value },
                    }));
                } else {
                    setJobFormData((prev) => ({ ...prev, [name]: value }));
                }
            }
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (user) {
                if (activeTab === 'general') {
                    const validationError = validateGeneralInfo(generalFormData);
                    if (validationError) {
                        toast.error(validationError);
                        return;
                    }
                    const updatedProfile = { ...profile, generalInfo: generalFormData };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile);
                    setProfile(updatedProfile);
                    setIsEditing(false);
                    setGeneralFormData({});
                    toast.success('General info updated successfully');
                } else if (activeTab === 'academic') {
                    const validationError = validateAcademicInfo(academicFormData);
                    if (validationError) {
                        toast.error(validationError);
                        return;
                    }
                    const newRecord = { ...academicFormData, id: Date.now().toString() } as AcademicRecord;
                    let updatedAcademicInfo = [...profile.academicInfo];
                    if (editingIndex !== null) {
                        updatedAcademicInfo[editingIndex] = newRecord;
                        toast.success('Academic record updated successfully');
                    } else {
                        updatedAcademicInfo.push(newRecord);
                        toast.success('Academic record added successfully');
                    }
                    const updatedProfile = { ...profile, academicInfo: updatedAcademicInfo };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile);
                    setProfile(updatedProfile);
                    setIsEditingAcademicInfo(false);
                    setAcademicFormData({
                        institution: '',
                        degreeType: '',
                        fieldOfStudy: '',
                        years: { from: '', to: '' },
                    });
                    setEditingIndex(null);
                } else if (activeTab === 'job') {
                    const validationError = validateJobInfo(jobFormData);
                    if (validationError) {
                        toast.error(validationError);
                        return;
                    }
                    const newRecord = { ...jobFormData, id: Date.now().toString() } as JobInfo;
                    let updatedJobInfo = [...profile.jobInfo];
                    if (editingIndex !== null) {
                        updatedJobInfo[editingIndex] = newRecord;
                        toast.success('Job info updated successfully');
                    } else {
                        updatedJobInfo.push(newRecord);
                        toast.success('Job info added successfully');
                    }
                    const updatedProfile = { ...profile, jobInfo: updatedJobInfo };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile);
                    setProfile(updatedProfile);
                    setIsEditingJobInfo(false);
                    setJobFormData({
                        currentJob: '',
                        company: '',
                        period: { from: '', to: '' },
                        employmentType: '',
                        location: '',
                        type: '',
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
        if (activeTab === 'academic') {
            setAcademicFormData(profile.academicInfo[index]);
        } else if (activeTab === 'job') {
            setJobFormData(profile.jobInfo[index]);
        }
        setEditingIndex(index);
        if (activeTab === 'academic') setIsEditingAcademicInfo(true);
        if (activeTab === 'job') setIsEditingJobInfo(true);
    };

    const handleDeleteRecord = async (index: number) => {
        setIsLoading(true);
        try {
            if (user) {
                let updatedData;
                if (activeTab === 'academic') {
                    updatedData = profile.academicInfo.filter((_, i) => i !== index);
                    const updatedProfile = { ...profile, academicInfo: updatedData };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile);
                    setProfile(updatedProfile);
                    toast.success('Academic record deleted successfully');
                } else if (activeTab === 'job') {
                    updatedData = profile.jobInfo.filter((_, i) => i !== index);
                    const updatedProfile = { ...profile, jobInfo: updatedData };
                    await setDoc(doc(db, 'profiles', user.uid), updatedProfile);
                    setProfile(updatedProfile);
                    toast.success('Job record deleted successfully');
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
            <Navbar />
            <div className="max-w-2xl mx-auto p-4">
                {isLoading && (
                    <div className="flex justify-center items-center h-64 animate-spin">
                        <AiOutlineLoading3Quarters color="#0B7DBF" size={30} />
                    </div>
                )}
                {!isLoading && (
                    <>
                        {/* Profile Header */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col items-center relative">
                            <FaUserCircle size={80} className="text-gray-400" />
                            <h2 className="text-xl font-bold mt-2 text-black">{user?.displayName || 'User'}</h2>
                            <p className="text-black">BioCAN ID - ABNH8283</p>

                            {activeTab === 'general' && (
                                <button
                                    onClick={handleEditToggle}
                                    className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                >
                                    <FaEdit size={16} />
                                    <span>Edit</span>
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b mb-4">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-black'}`}
                            >
                                General Info
                            </button>
                            <button
                                onClick={() => setActiveTab('academic')}
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === 'academic' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-black'}`}
                            >
                                Academic Info
                            </button>
                            <button
                                onClick={() => setActiveTab('job')}
                                className={`px-4 py-2 font-semibold hover:cursor-pointer ${activeTab === 'job' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-black'}`}
                            >
                                Job Info
                            </button>
                        </div>

                        {/* Tab Content */}
                        {!isLoading && (
                            <>
                                {activeTab === 'general' && (
                                    <div className="bg-white rounded-lg shadow-md p-4">
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-black font-medium">Mobile</label>
                                                    <input
                                                        type="text"
                                                        name="mobile"
                                                        value={generalFormData.mobile || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={generalFormData.email || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">DOB</label>
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        value={generalFormData.dob || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Gender</label>
                                                    <input
                                                        type="text"
                                                        name="gender"
                                                        value={generalFormData.gender || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={generalFormData.state || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={generalFormData.city || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={generalFormData.pincode || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-black font-medium">Mobile</p>
                                                    <p className="text-black">{profile.generalInfo.mobile || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-black font-medium">Email</p>
                                                    <p className="text-black">{profile.generalInfo.email || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-black font-medium">DOB</p>
                                                    <p className="text-black">{profile.generalInfo.dob || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-black font-medium">Gender</p>
                                                    <p className="text-black">{profile.generalInfo.gender || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-black font-medium">State</p>
                                                    <p className="text-black">{profile.generalInfo.state || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-black font-medium">City</p>
                                                    <p className="text-black">{profile.generalInfo.city || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-black font-medium">Pincode</p>
                                                    <p className="text-black">{profile.generalInfo.pincode || '-'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'academic' && (
                                    <div className="bg-white rounded-lg shadow-md p-4">
                                        {isEditingAcademicInfo && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-black font-medium">Institution</label>
                                                    <input
                                                        type="text"
                                                        name="institution"
                                                        value={academicFormData.institution}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Degree Type</label>
                                                    <input
                                                        type="text"
                                                        name="degreeType"
                                                        value={academicFormData.degreeType}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Field of Study</label>
                                                    <input
                                                        type="text"
                                                        name="fieldOfStudy"
                                                        value={academicFormData.fieldOfStudy}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Years</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            name="from"
                                                            value={academicFormData.years.from}
                                                            onChange={handleInputChange}
                                                            className="w-1/2 p-2 border rounded text-black"
                                                            placeholder="From"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="to"
                                                            value={academicFormData.years.to}
                                                            onChange={handleInputChange}
                                                            className="w-1/2 p-2 border rounded text-black"
                                                            placeholder="To"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setIsEditingAcademicInfo(false)}
                                                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                                                    >
                                                        {editingIndex !== null ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {!isEditingAcademicInfo &&
                                            profile.academicInfo.map((record, index) => (
                                                <div key={record.id} className="bg-gray-50 p-4 rounded-lg mb-2 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-black"><strong>Institution:</strong> {record.institution}</p>
                                                        <p className="text-black"><strong>Degree Type:</strong> {record.degreeType}</p>
                                                        <p className="text-black"><strong>Field of Study:</strong> {record.fieldOfStudy}</p>
                                                        <p className="text-black"><strong>Years:</strong> {record.years.from} to {record.years.to}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteRecord(index)}
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        {!isEditingAcademicInfo && (
                                            <button
                                                onClick={() => setIsEditingAcademicInfo(true)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2 cursor-pointer"
                                            >
                                                <IoAddCircle size={20} />
                                                <span className="text-black">Add Academic Record</span>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'job' && (
                                    <div className="bg-white rounded-lg shadow-md p-4">
                                        {isEditingJobInfo && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-black font-medium">Current Job</label>
                                                    <input
                                                        type="text"
                                                        name="currentJob"
                                                        value={jobFormData.currentJob || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Company</label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={jobFormData.company || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Period</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            name="from"
                                                            value={jobFormData.period?.from || ''}
                                                            onChange={handleInputChange}
                                                            className="w-1/2 p-2 border rounded text-black"
                                                            placeholder="From"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="to"
                                                            value={jobFormData.period?.to || ''}
                                                            onChange={handleInputChange}
                                                            className="w-1/2 p-2 border rounded text-black"
                                                            placeholder="To"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Employment Type</label>
                                                    <input
                                                        type="text"
                                                        name="employmentType"
                                                        value={jobFormData.employmentType || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Location</label>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={jobFormData.location || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-black font-medium">Type</label>
                                                    <input
                                                        type="text"
                                                        name="type"
                                                        value={jobFormData.type || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded text-black"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setIsEditingJobInfo(false)}
                                                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                                                    >
                                                        {editingIndex !== null ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {!isEditingJobInfo &&
                                            profile.jobInfo.map((record, index) => (
                                                <div key={record.id} className="bg-gray-50 p-4 rounded-lg mb-2 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-black"><strong>Current Job:</strong> {record.currentJob}</p>
                                                        <p className="text-black"><strong>Company:</strong> {record.company}</p>
                                                        <p className="text-black"><strong>Period:</strong> {record.period?.from} to {record.period?.to}</p>
                                                        <p className="text-black"><strong>Employment Type:</strong> {record.employmentType || '-'}</p>
                                                        <p className="text-black"><strong>Location:</strong> {record.location || '-'}</p>
                                                        <p className="text-black"><strong>Type:</strong> {record.type || '-'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteRecord(index)}
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        {!isEditingJobInfo && (
                                            <button
                                                onClick={() => setIsEditingJobInfo(true)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2 cursor-pointer"
                                            >
                                                <IoAddCircle size={20} />
                                                <span className="text-black">Add Job Record</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;