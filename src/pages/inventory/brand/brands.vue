<template>
    <DefaultLayout>
        <div class="content">
            <div class="page-heading">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <h2>{{ $t('Our Brands') }}</h2>
                            </div>
                            <div class="col-auto">
                                <a href="#" data-bs-toggle="modal" data-bs-target="#add_brand" class="btn btn-sm btn-light-primary"><i class="fa-solid fa-plus"></i>{{ $t('New Brand') }}</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <div class="form-field page-heading-search-field mb-0">
                                    <div class="field-icon">
                                        <input type="text" class="form-control form-control-sm form-control-shadow" placeholder="Search...">
                                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="dropdown filter-dropdown">
                                    <button type="button" class="btn btn-sm btn-icon btn-light-primary" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                        <Icon icon="fa6-solid:filter" />
                                    </button>
                                    <div class="dropdown-menu">
                                        <form>
                                            <div class="row gx-3">
                                                <div class="col-6">
                                                    <div class="form-field">
                                                        <label for="" class="form-label">{{ $t('Label') }}</label>
                                                        <input type="text" class="form-control form-control-sm form-control-solid" id="" placeholder="">
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div class="form-field">
                                                        <label for="" class="form-label">{{ $t('Status') }}</label>
                                                        <select class="form-select form-select-sm form-select-solid" >
                                                            <option>{{ $t('Active') }}</option>
                                                            <option>{{ $t('Inactive') }}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row gx-3">
                                                <div class="col-6">
                                                    <div class="form-field">
                                                        <label for="" class="form-label">{{ $t('Created On') }}</label>
                                                        <input type="date" class="form-control form-control-sm form-control-solid" id="" placeholder="">
                                                    </div>
                                                </div>
                                               
                                                <div class="col-6">
                                                    <div class="form-field">
                                                        <label for="" class="form-label">{{ $t('Label') }}</label>
                                                        <input type="text" class="form-control form-control-sm form-control-solid" id="" placeholder="Administrator">
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="submit" class="btn btn-sm btn-primary w-100">{{ $t('Apply Now') }}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto">
                                
                                <div class="filter-item-field ms-2">
                                    <label>{{ $t('Show') }}</label>
                                    <div>
                                        <select class="form-select form-select-sm form-select-shadow" >
                                            <option>10</option>
                                            <option>20</option>
                                            <option>30</option>
                                            <option>40</option>
                                            <option>50</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-list-data table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col">{{ $t('Label') }}</th>
                            <th scope="col">{{ $t('Status') }}</th>
                            <th scope="col">{{ $t('Created On') }}</th>
                            <th scope="col">{{ $t('Updated On') }}</th>
                            <th scope="col">{{ $t('Created By') }}</th>
                            <th scope="col" class="text-end">{{ $t('Action') }}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">Edit</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">View</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                            <td><b>XYZ Label</b></td>
                            <td>
                                <span class="badge badge-success">{{ $t('Active') }}</span>
                            </td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>8-6-2022  08:30 PM</td>
                            <td>Administrator</td>
                            <td class="text-end">
                                <div class="dropdown">
                                    <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Icon icon="fa6-solid:ellipsis-vertical" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-bs-target="#edit_modal" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('Edit') }}</a></li>
                                        <li><a class="dropdown-item" data-bs-target="#brand_name" data-bs-toggle="modal" href="javascript:void(0);">{{ $t('View') }}</a></li>
                                        <li><a class="dropdown-item" href="#">{{ $t('Delete') }}</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr> 
                    </tbody>
                </table>
            </div>
            <div class="data-footer">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <div class="filter-item-field">
                            <label>{{ $t('Show') }}</label>
                            <div>
                                <select class="form-select form-select-sm form-select-shadow" >
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>40</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <label class="me-0 ms-2">{{ $t('Entries') }}</label>
                            <label class="ms-4 me-0">Showing 1 to 25 of 92 entries</label>
                        </div>
                    </div>
                    <div class="col-auto">
                        <ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true"><i class="fa-solid fa-chevron-left"></i></span>
                                </a>
                            </li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">4</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </DefaultLayout>
</template>

<script setup>

import { ref , onMounted } from 'vue';

import DefaultLayout from '@/layouts/DefaultLayout.vue'

onMounted(() => {
    //this.$refs.AddCategory.show();
});

</script>