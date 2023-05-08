import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/core/loader.service';
import { DSRService } from 'src/app/services/dsr.service';

@Component({
  selector: 'app-daily-sales-report-list',
  templateUrl: './daily-sales-report-list.component.html',
  styleUrls: ['./daily-sales-report-list.component.css'],
  providers: []
})
export class DailySalesReportListComponent {
  @ViewChild('zircaTable', { static: false }) zircaTable: Table;
  columnList = [
    {
      header: 'Visit Date',
      field: 'VisitDate',
      width: 160,
      dateFormat: 'DD-MM-YYYY',
      filterable: true,
    },
    {
      header: 'Channel Name',
      field: 'ChannelName',
      truncate: true,
      filterable: true,
      filterType: 'text',
      width: 360,
      // cellRenderer: (row) => (row.AdvertiserName || '').slice(0, 15),
      sortable: true,
    },
    {
      header: 'People Met',
      field: 'PeopleMeet',
      width: 160,
      filterable: true,
      cellRenderer: (row) => `${row.PeopleMeet}`,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Agency',
      field: 'AgencyName',
      truncate: true,
      filterable: true,
      filterType: 'text',
      width: 360,
      // cellRenderer: (row) => (row.AdvertiserName || '').slice(0, 15),
      sortable: true,
    },
    {
      header: 'Advertiser',
      field: 'AdvertiserName',
      truncate: true,
      filterable: true,
      filterType: 'text',
      width: 360,
      // cellRenderer: (row) => (row.AdvertiserName || '').slice(0, 15),
      sortable: true,
    },
    {
      header: 'Brand',
      field: 'BrandNames',
      width: 160,
      cellRenderer: (row) => {
        const brands = (row.BrandNames || '').split(',');
        if (brands && brands.length && brands.length > 1) {
          return `<span>${brands[0]}</span>
          <a class="w-100 text-primary cursor-pointer font-12">More...</a>`;
        } else if (brands[0]) {
          return `<span>${brands[0] || ''}</span>`;
        } else {
          return '';
        }
      },
      click: (row) => row.BrandNames && this.showMoreRemarks(row, 'BrandNames', 'Brand'),
      truncate: true,
      filterable: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Purpose',
      field: 'SubjectName',
      width: 160,
      cellRenderer: (row) => {
        if (row.ProposalValue) {
          return `<b>${row.SubjectName}</b>`;
        } else {
          return `<b>${row.SubjectName}</b>`;
        }
      },
      filterable: false,
    },
    {
      header: 'Value',
      field: 'ProposalValue',
      width: 160,
      cellRenderer: (row) => {
        if (row.ProposalValue) {
          return `Rs.${row.ProposalValue}`;
        } else {
          return ``;
        }
      },
      filterable: false,
    },



    {
      header: 'Remarks',
      field: 'Remark',
      width: 288,
      filterable: false,
      truncate: true,
      cellRenderer: (row) => {
        if ((row.Remark || '').length > 30) {
          return `${(row.Remark || '').slice(0, 30)}
          <a class="w-100 text-primary cursor-pointer font-12"> More...</a>`;
        } else {
          return (row.Remark || '');
        }
      },
      click: (row) => this.showMoreRemarks(row, 'Remark', 'Remarks'),
      filterType: 'text',
      sortable: false,
    },
    {
      header: 'Accompanied By',
      field: 'AccompaniedBy',
      width: 160,
      filterable: true,
      filterType: 'text',
      sortable: true,
    }
    // {
    //   header: 'Reminders',
    //   field: 'ReminderRemark',
    //   width: 160,
    //   filterable: true,
    //   filterType: 'text',
    //   sortable: true,
    // }
  ];

  actionColumn = {
    header: 'Action',
    styles: {
      'width': '160px',
      'text-align': 'center'
    },
    columns: [
      {
        header: 'Edit',
        field: 'EDIT',
        paramKey: 'VisitCode',
        show: true,
        routeLink: 'daily-sales-report/edit'
      },]
  };

  paginateDetails = {
    page_size: 10,
    page_index: 1,
    filters: [],
  };
  reportList = [];
  count = 0;
  openShowMoreModal = false;
  showMoreTaxt = '';
  headerTaxt = '';
  loggedInUserCode = '';
  exportExcel: any = false;

  selectedUser = new FormControl()
  startDate = new FormControl(this.getLastWeekDate());
  endDate = new FormControl(new Date().toISOString().split('T')[0]);


  constructor(
    public dsrService: DSRService,
    private router: Router,
    private route: ActivatedRoute,
    private _loaderService: LoaderService) {
    this.loggedInUserCode = decodeURI(this.route.snapshot.queryParams.uCode);
    console.log(this.loggedInUserCode)
  }

  ngOnInit(): void {
    this.getAllReports();
  }

  getAllReports() {
    this._loaderService.ShowLoader();
    this.dsrService.getVisitReportList(this.loggedInUserCode, this.startDate.value, this.endDate.value).subscribe(res => {
      this.count = (res || []).length;
      this.reportList = (res || []);
      this._loaderService.HideLoader();
    }, err => {
      this._loaderService.HideLoader();
    });
  }

  onTableChange(table) {
    const event = table.data;
    setTimeout(() => { this.getAllReports() });
  }

  onSearchClick() {
    setTimeout(() => { this.getAllReports() });
  }

  onAddNewVisit() {
    this.router.navigate(['daily-sales-report/add'], { queryParamsHandling: "merge" });
  }

  showMoreRemarks(row, column, title) {
    this.headerTaxt = title;
    if (title == 'Brand') {
      const brands = (row.BrandNames || '').split(',');
      let newBrands = '';
      (brands || []).forEach(brd => {
        newBrands += `<div>• ${brd}</div>`
      });
      this.showMoreTaxt = newBrands;
    } else {
      this.showMoreTaxt = row[column];
    }
    this.openShowMoreModal = true;
  }

  getLastWeekDate() {
    var d = new Date();
    d.setDate(d.getDate() - 7);

    return d.toISOString().split('T')[0];
  }

  exportCSV() {
    const name = `DSR_REPORT_${this.loggedInUserCode}`;

    if (!(this.reportList || []).length) {
      return;
    }

    this.exportExcel = Math.random();
    // this.zircaTable.exportFilename = name;
    // this.zircaTable.exportCSV();
  }

}
