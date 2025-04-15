import React from "react";
import "./main.css"; // Import your custom CSS

function ViewInfo() {
  return (
    <div className="view-info">
      <h1 className="title">Luinab Information</h1>

      {/* Summary of Data */}
      <section className="summary">
        <h2>📌 Summary of Data</h2>
        <div className="summary-card">
          <ul>
            <li><strong>🏠 Type:</strong> Barangay</li>
            <li><strong>🌍 Island Group:</strong> Mindanao</li>
            <li><strong>📍 Region:</strong> Northern Mindanao (Region X)</li>
            <li><strong>🏙️ City:</strong> Iligan</li>
            <li><strong>📮 Postal Code:</strong> 9200</li>
            <li><strong>👥 Population (2020):</strong> 11,108</li>
            <li><strong>🏝️ Major Island(s):</strong> Mindanao</li>
            <li><strong>📌 Coordinates:</strong> 8.2472, 124.2681 (8° 15' N, 124° 16' E)</li>
            <li><strong>⛰️ Elevation:</strong> 10.5 meters (34.4 feet)</li>
          </ul>
        </div>
      </section>

      {/* Demographics */}
      <section className="demographics">
        <h2>📊 Demographics</h2>
        <p><strong>Households:</strong> The household population of Luinab in the 2015 Census was 8,603, broken down into 1,867 households, with an average of 4.61 members per household.</p>
        
        {/* Census Data Table */}
        <table className="census-table">
          <thead>
            <tr>
              <th>Census Date</th>
              <th>Household Population</th>
              <th>Number of Households</th>
              <th>Average Household Size</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>1990 May 1</strong></td><td>—</td><td>0</td><td>—</td></tr>
            <tr><td><strong>1995 Sep 1</strong></td><td>4,682</td><td>878</td><td>5.33</td></tr>
            <tr><td><strong>2000 May 1</strong></td><td>5,058</td><td>1,045</td><td>4.84</td></tr>
            <tr><td><strong>2007 Aug 1</strong></td><td>6,163</td><td>1,341</td><td>4.60</td></tr>
            <tr><td><strong>2010 May 1</strong></td><td>8,114</td><td>1,724</td><td>4.71</td></tr>
            <tr><td><strong>2015 Aug 1</strong></td><td>8,603</td><td>1,867</td><td>4.61</td></tr>
          </tbody>
        </table>

        {/* Population Growth Chart */}
        <div className="population-chart">
          <h3>📈 Household Population Growth (1990-2015)</h3>
          <img src="/population.png" alt="Population Growth Chart"  />
        </div>
      </section>

      {/* Population by Age Group */}
      <section className="age-group">
        <h2>📌 Population by Age Group</h2>
        <p>According to the 2015 Census, the age group with the highest population in Luinab is <strong>15 to 19</strong>, with <strong>970</strong> individuals. Conversely, the age group with the lowest population is <strong>80 and over</strong>, with only <strong>51</strong> individuals.</p>
      
        {/* Historical Population Data */}
        <div className="historical-population">
          <h3>📈 Historical Population</h3>
          <p>The population of Luinab grew from 4,682 in 1995 to 11,108 in 2020, an increase of 6,426 people over 25 years. The latest census figures in 2020 denote a positive growth rate of 5.53%, or an increase of 2,505 people from the previous population of 8,603 in 2015.</p>
          
          {/* Population Growth Table */}
          <table className="growth-table">
            <thead>
              <tr>
                <th>Census Date</th>
                <th>Population</th>
                <th>Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>1990 May 1</strong></td><td>—</td><td>—</td></tr>
              <tr><td><strong>1995 Sep 1</strong></td><td>4,682</td><td>—</td></tr>
              <tr><td><strong>2000 May 1</strong></td><td>5,058</td><td>1.67%</td></tr>
              <tr><td><strong>2007 Aug 1</strong></td><td>6,163</td><td>2.76%</td></tr>
              <tr><td><strong>2010 May 1</strong></td><td>8,114</td><td>10.53%</td></tr>
              <tr><td><strong>2015 Aug 1</strong></td><td>8,603</td><td>1.12%</td></tr>
              <tr><td><strong>2020 May 1</strong></td><td>11,108</td><td>5.53%</td></tr>
            </tbody>
          </table>
          
          {/* Population Growth Chart */}
          <div className="population-chart">
            <h3>📊 Population Growth (1990-2020)</h3>
            <img src="/pop.png" alt="Population Growth Chart" />
          </div>
        </div>
      </section>
    
      

      {/* Adjacent Barangays */}
      <section className="adjacent-barangays">
        <h2>🌍 Adjacent Barangays</h2>
        <p>Luinab shares a common border with the following barangays:</p>
        <ul>
          <li>📍 Mandulog, Iligan</li>
          <li>📍 Hinaplanon, Iligan</li>
          <li>📍 Del Carmen, Iligan</li>
          <li>📍 Puga-an, Iligan</li>
          <li>📍 Upper Hinaplanon, Iligan</li>
          <li>📍 Bagong Silang, Iligan</li>
        </ul>
      </section>
    {/* Notes Section */}
<section className="important-notes">
  <h2>⚠️ Important Notes</h2>
  <p><strong> ◆ Data on population and households</strong> are sourced from the <strong>Philippine Statistics Authority</strong>.</p>
  <p><strong> ◆ Postal code information</strong> is from the <strong>Philippine Postal Corporation</strong>.</p>
</section>


    </div>

    
  );
}

export default ViewInfo;
