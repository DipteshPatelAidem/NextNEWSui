import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/core/loader.service';
import { UCNService } from 'src/app/services/ucn.service';

@Component({
  selector: 'app-ucm-list',
  templateUrl: './ucm-list.component.html',
  styleUrls: ['./ucm-list.component.css']
})
export class UcmListComponent {
  @ViewChild('zircaTable', { static: false }) zircaTable: Table;

  columnList = [
    {
      header: 'Code',
      field: 'ucnCode',
      width: 160,
      copyIcon: true,
      styles: {
        'display': 'inline-flex',
        'gap': '6px'
      },
      filterable: false,
    },
    {
      header: 'Created Date',
      field: 'VisitDate',
      width: 160,
      dateFormat: 'DD-MM-YYYY',
      filterable: false,
    },
    {
      header: 'Brand',
      field: 'ChannelName',
      truncate: true,
      filterable: true,
      filterType: 'text',
      width: 360,
      // cellRenderer: (row) => (row.AdvertiserName || '').slice(0, 15),
      sortable: true,
    },
    {
      header: 'Caption',
      field: 'caption',
      width: 160,
      filterable: true,
      cellRenderer: (row) => `${row.caption}`,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Duration',
      field: 'Duration',
      truncate: true,
      filterable: true,
      filterType: 'text',
      width: 360,
      // cellRenderer: (row) => (row.AdvertiserName || '').slice(0, 15),
      sortable: true,
    },
    {
      header: 'Language',
      field: 'Language',
      truncate: true,
      filterable: true,
      filterType: 'text',
      width: 360,
      // cellRenderer: (row) => (row.AdvertiserName || '').slice(0, 15),
      sortable: true,
    },
    {
      header: 'Platform',
      field: 'Platform',
      truncate: true,
      filterable: true,
      filterType: 'text',
      sortable: true,
    },
    {
      header: 'Format',
      field: 'Format',
      width: 160,
      filterable: false,
    },
    {
      header: 'Ratio',
      field: 'Ratio',
      width: 160,
      filterable: false,
    }
  ];
  actionColumn = null;

  paginateDetails = {
    page_size: 10,
    page_index: 1,
    filters: [],
  };

  ucnList = [];
  count = 0;
  loggedInUserCode = '';
  exportExcel: any = false;

  constructor(
    public ucnService: UCNService,
    private router: Router,
    private route: ActivatedRoute,
    private _loaderService: LoaderService) {
    this.loggedInUserCode = decodeURI(this.route.snapshot.queryParams.uCode);
    console.log(this.loggedInUserCode)
  }

  ngOnInit(): void {
    this.getAllUCN();
  }

  getAllUCN() {
    this._loaderService.ShowLoader();
    this.ucnService.getAllUCN(this.loggedInUserCode).subscribe(res => {
      this.count = (res || []).length;

      (res || []).forEach((a, index) => {
        a.ucnCode = 'HELLO' + index;
      });

      this.ucnList = (res || []);
      this._loaderService.HideLoader();
    }, err => {
      this._loaderService.HideLoader();
    });
  }

  onTableChange(table) {
    const event = table.data;
    setTimeout(() => { this.getAllUCN() });
  }

  onAddNewUCN() {
    this.router.navigate(['ucn-digital/add'], { queryParamsHandling: "merge" });
  }

  exportCSV() {
    const name = `DSR_REPORT_${this.loggedInUserCode}`;

    if (!(this.ucnList || []).length) {
      return;
    }

    this.exportExcel = Math.random();
  }
}
