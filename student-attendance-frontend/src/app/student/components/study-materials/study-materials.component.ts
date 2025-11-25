import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';

interface StudyMaterial {
  id: number;
  title: string;
  course: string;
  courseCode: string;
  type: 'PDF' | 'DOC' | 'PPT' | 'VIDEO' | 'LINK';
  fileSize?: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  downloadUrl?: string;
}

@Component({
  selector: 'app-study-materials',
  templateUrl: './study-materials.component.html',
  styleUrls: ['./study-materials.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    DateFormatPipe,
    FilterPipe,
  ],
})
export class StudyMaterialsComponent implements OnInit {
  materials: StudyMaterial[] = [];
  filteredMaterials: StudyMaterial[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCourse = 'All';
  selectedType = 'All';

  courses = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  types = ['All', 'PDF', 'DOC', 'PPT', 'VIDEO', 'LINK'];

  constructor() {}

  ngOnInit(): void {
    this.loadStudyMaterials();
  }

  loadStudyMaterials(): void {
    this.isLoading = true;
    // Mock data - in real app, fetch from service
    setTimeout(() => {
      this.materials = [
        {
          id: 1,
          title: 'Algebra Basics',
          course: 'Mathematics',
          courseCode: 'MATH101',
          type: 'PDF',
          fileSize: '2.4 MB',
          uploadDate: '2024-01-15',
          uploadedBy: 'Dr. Smith',
          description:
            'Fundamental concepts of algebra including equations and inequalities',
          downloadUrl: '#',
        },
        {
          id: 2,
          title: 'Physics Lab Manual',
          course: 'Physics',
          courseCode: 'PHY101',
          type: 'DOC',
          fileSize: '1.8 MB',
          uploadDate: '2024-01-16',
          uploadedBy: 'Prof. Johnson',
          description: 'Complete laboratory manual for physics experiments',
          downloadUrl: '#',
        },
        {
          id: 3,
          title: 'Chemical Reactions',
          course: 'Chemistry',
          courseCode: 'CHEM101',
          type: 'PPT',
          fileSize: '4.2 MB',
          uploadDate: '2024-01-17',
          uploadedBy: 'Ms. Davis',
          description: 'Presentation on chemical reactions and equations',
          downloadUrl: '#',
        },
        {
          id: 4,
          title: 'Cell Biology Video',
          course: 'Biology',
          courseCode: 'BIO101',
          type: 'VIDEO',
          fileSize: '15.7 MB',
          uploadDate: '2024-01-18',
          uploadedBy: 'Mr. Wilson',
          description: 'Video lecture on cell structure and functions',
          downloadUrl: '#',
        },
        {
          id: 5,
          title: 'Online Resources',
          course: 'Mathematics',
          courseCode: 'MATH101',
          type: 'LINK',
          uploadDate: '2024-01-19',
          uploadedBy: 'Dr. Smith',
          description: 'Collection of useful online resources for mathematics',
          downloadUrl: '#',
        },
      ];
      this.filteredMaterials = this.materials;
      this.isLoading = false;
    }, 1000);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.materials];

    // Apply course filter
    if (this.selectedCourse !== 'All') {
      filtered = filtered.filter(
        (material) => material.course === this.selectedCourse
      );
    }

    // Apply type filter
    if (this.selectedType !== 'All') {
      filtered = filtered.filter(
        (material) => material.type === this.selectedType
      );
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(
        (material) =>
          material.title
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          material.course
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          material.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredMaterials = filtered;
  }

  getFileIcon(type: string): string {
    switch (type) {
      case 'PDF':
        return 'fas fa-file-pdf';
      case 'DOC':
        return 'fas fa-file-word';
      case 'PPT':
        return 'fas fa-file-powerpoint';
      case 'VIDEO':
        return 'fas fa-file-video';
      case 'LINK':
        return 'fas fa-link';
      default:
        return 'fas fa-file';
    }
  }

  getFileColor(type: string): string {
    switch (type) {
      case 'PDF':
        return 'text-red-500';
      case 'DOC':
        return 'text-blue-500';
      case 'PPT':
        return 'text-orange-500';
      case 'VIDEO':
        return 'text-purple-500';
      case 'LINK':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }

  downloadMaterial(material: StudyMaterial): void {
    // Mock download functionality
    console.log('Downloading:', material.title);
    alert(`Downloading ${material.title}`);
  }

  viewMaterial(material: StudyMaterial): void {
    // Mock view functionality
    console.log('Viewing:', material.title);
    alert(`Opening ${material.title}`);
  }

  getTotalSize(): string {
    const totalSize = this.filteredMaterials.reduce((total, material) => {
      if (material.fileSize) {
        const size = parseFloat(material.fileSize);
        return total + (isNaN(size) ? 0 : size);
      }
      return total;
    }, 0);
    return totalSize > 0 ? `${totalSize.toFixed(1)} MB` : 'N/A';
  }
}
