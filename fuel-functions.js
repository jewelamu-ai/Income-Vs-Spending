// Fuel Tracking Functions - Add these to your HTML file

function openFuelModal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    document.getElementById('fuelDate').value = dateTimeString;
    document.getElementById('fuelQuantity').value = '';
    document.getElementById('fuelAmount').value = '';
    document.getElementById('fuelStation').value = '';
    document.getElementById('fuelOdometer').value = '';
    document.getElementById('fuelType').value = '';
    document.getElementById('fuelNotes').value = '';
    
    document.getElementById('fuelModal').classList.remove('hidden');
}

function closeFuelModal() {
    document.getElementById('fuelModal').classList.add('hidden');
}

function saveFuelEntry() {
    const date = document.getElementById('fuelDate').value;
    const quantity = parseFloat(document.getElementById('fuelQuantity').value);
    const amount = parseFloat(document.getElementById('fuelAmount').value);
    const station = document.getElementById('fuelStation').value;
    const odometer = document.getElementById('fuelOdometer').value;
    const fuelType = document.getElementById('fuelType').value;
    const notes = document.getElementById('fuelNotes').value;
    
    if (!date || !quantity || !amount || !station || !odometer) {
        alert('Please fill in all required fields (Date, Quantity, Amount, Station, Odometer)');
        return;
    }
    
    if (quantity <= 0 || amount <= 0) {
        alert('Quantity and Amount must be greater than 0');
        return;
    }
    
    const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        date: date,
        quantity: quantity,
        amount: amount,
        station: station,
        odometer: parseFloat(odometer),
        fuelType: fuelType || 'Petrol',
        notes: notes,
        pricePerLiter: (amount / quantity).toFixed(2)
    };
    
    fuelEntries.push(entry);
    fuelEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    saveToFirebase();
    renderFuelList();
    updateFuelStats();
    closeFuelModal();
    
    alert(`✅ Fuel entry saved!\n\nStation: ${station}\nQuantity: ${quantity} L\nAmount: GHS${amount.toFixed(2)}`);
}

function deleteFuelEntry(id) {
    if (!confirm('Are you sure you want to delete this fuel entry?')) {
        return;
    }
    
    fuelEntries = fuelEntries.filter(f => f.id !== id);
    saveToFirebase();
    renderFuelList();
    updateFuelStats();
}

function renderFuelList() {
    const container = document.getElementById('fuelList');
    
    if (!fuelEntries || fuelEntries.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                <p>No fuel entries yet. Start by adding your first fuel purchase!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = fuelEntries.map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800 text-lg">${entry.station}</h3>
                        <p class="text-sm text-gray-600">${dateStr}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-orange-600 text-lg">GHS${entry.amount.toFixed(2)}</p>
                        <p class="text-sm text-gray-600">@ GHS${entry.pricePerLiter}/L</p>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-3 mb-3 text-sm">
                    <div class="bg-blue-50 p-2 rounded-lg">
                        <p class="text-gray-600 text-xs">Quantity</p>
                        <p class="font-bold text-blue-600">${entry.quantity} L</p>
                    </div>
                    <div class="bg-green-50 p-2 rounded-lg">
                        <p class="text-gray-600 text-xs">Odometer</p>
                        <p class="font-bold text-green-600">${entry.odometer.toLocaleString()} km</p>
                    </div>
                    <div class="bg-purple-50 p-2 rounded-lg">
                        <p class="text-gray-600 text-xs">Fuel Type</p>
                        <p class="font-bold text-purple-600">${entry.fuelType}</p>
                    </div>
                    <div class="bg-gray-100 p-2 rounded-lg">
                        <p class="text-gray-600 text-xs">Cost/km</p>
                        <p class="font-bold text-gray-600">GHS${(entry.amount / entry.quantity / 10).toFixed(3)}</p>
                    </div>
                </div>
                ${entry.notes ? `<p class="text-xs text-gray-600 mb-2"><strong>Notes:</strong> ${entry.notes}</p>` : ''}
                <div class="flex gap-2">
                    <button onclick="deleteFuelEntry('${entry.id}')" class="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateFuelStats() {
    if (!fuelEntries || fuelEntries.length === 0) {
        document.getElementById('fuelTotalSpent').textContent = 'GHS0.00';
        document.getElementById('fuelTotalQty').textContent = '0 L';
        document.getElementById('fuelAvgPrice').textContent = 'GHS0.00';
        document.getElementById('fuelRecordCount').textContent = '0';
        return;
    }
    
    const totalSpent = fuelEntries.reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalQty = fuelEntries.reduce((sum, f) => sum + (f.quantity || 0), 0);
    const avgPrice = totalQty > 0 ? totalSpent / totalQty : 0;
    
    document.getElementById('fuelTotalSpent').textContent = 'GHS' + totalSpent.toFixed(2);
    document.getElementById('fuelTotalQty').textContent = totalQty.toFixed(2) + ' L';
    document.getElementById('fuelAvgPrice').textContent = 'GHS' + avgPrice.toFixed(2);
    document.getElementById('fuelRecordCount').textContent = fuelEntries.length;
}

// Call updateFuelStats and renderFuelList in the init() function
