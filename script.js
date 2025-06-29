const selectCabang = document.getElementById("select-cabang");
const form = document.getElementById("form-laporan");
const tabelLaporan = document.getElementById("tabel-laporan");
const inputCabangBaru = document.getElementById("input-cabang-baru");
const tambahCabangBtn = document.getElementById("tambah-cabang-btn");
const labelCabang = document.getElementById("label-cabang-terpilih");

let dataCabang = {};
let cabangTerpilih = "";

selectCabang.addEventListener("change", () => {
	const selected = selectCabang.value;
	if (selected === "Tambah") {
		inputCabangBaru.style.display = "inline-block";
		tambahCabangBtn.style.display = "inline-block";
		form.style.display = "none";
		labelCabang.innerHTML = "";
	} else {
		cabangTerpilih = selected;
		tampilkanDataCabang();
		form.style.display = "grid";
		inputCabangBaru.style.display = "none";
		tambahCabangBtn.style.display = "none";
		labelCabang.innerHTML = `<strong>Cabang aktif:</strong> ${cabangTerpilih}`;
	}
});

tambahCabangBtn.addEventListener("click", () => {
	const newCabang = inputCabangBaru.value.trim();
	if (newCabang) {
		const option = document.createElement("option");
		option.value = newCabang;
		option.textContent = newCabang;
		selectCabang.insertBefore(option, selectCabang.lastElementChild);
		selectCabang.value = newCabang;
		inputCabangBaru.value = "";
		inputCabangBaru.style.display = "none";
		tambahCabangBtn.style.display = "none";
		cabangTerpilih = newCabang;
		tampilkanDataCabang();
		form.style.display = "grid";
		labelCabang.innerHTML = `<strong>Cabang aktif:</strong> ${cabangTerpilih}`;
	}
});

form.addEventListener("submit", function (e) {
	e.preventDefault();

	const tanggal = document.getElementById("tanggal").value;
	const stock = parseInt(document.getElementById("stock").value);
	const sold = parseInt(document.getElementById("sold").value);
	const reject = parseInt(document.getElementById("reject").value);
	const karyawan = parseInt(document.getElementById("karyawan").value);
	const bonus = parseInt(document.getElementById("bonus").value);
	const total = parseInt(document.getElementById("total").value);
	const sisa = stock - (sold + reject + karyawan + bonus);

	const laporan = {
		tanggal,
		stock,
		sold,
		reject,
		karyawan,
		bonus,
		sisa,
		total,
	};

	if (!dataCabang[cabangTerpilih]) {
		dataCabang[cabangTerpilih] = [];
	}

	dataCabang[cabangTerpilih].push(laporan);
	tampilkanDataCabang();
	form.reset();
});

function tampilkanDataCabang() {
	tabelLaporan.innerHTML = "";
	const laporanCabang = dataCabang[cabangTerpilih] || [];
	laporanCabang.forEach((item) => {
		const row = document.createElement("tr");
		row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.stock}</td>
      <td>${item.sold}</td>
      <td>${item.reject}</td>
      <td>${item.karyawan}</td>
      <td>${item.bonus}</td>
      <td>${item.sisa}</td>
      <td>${item.total.toLocaleString("id-ID")}</td>
    `;
		tabelLaporan.appendChild(row);
	});
}
document.getElementById("export-excel-btn").addEventListener("click", () => {
	if (
		!cabangTerpilih ||
		!dataCabang[cabangTerpilih] ||
		dataCabang[cabangTerpilih].length === 0
	) {
		alert("Tidak ada data untuk diexport.");
		return;
	}

	const data = dataCabang[cabangTerpilih].map((row) => ({
		Tanggal: row.tanggal,
		Stock: row.stock,
		Terjual: row.sold,
		Reject: row.reject,
		"Makan Karyawan": row.karyawan,
		Bonus: row.bonus,
		Sisa: row.sisa,
		Total: row.total,
	}));

	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, cabangTerpilih);

	XLSX.writeFile(workbook, `Laporan_Penjualan_${cabangTerpilih}.xlsx`);
});
