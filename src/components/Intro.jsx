import React from 'react';
import { Alert } from 'react-bootstrap';

const text = 'Select a topic and indicator to view either a map or a chart. Clicking a neighborhood on the map, chart, or table will bring up detailed information on that neighborhood. See all neighborhoods in the table below.';

const Intro = () => (
	<div className='Intro'>
		<Alert variant='light' className='border border-color-info'>
			<p>{ text } For more information, visit DataHaven's <a href="http://www.ctdatahaven.org/communities">Communities</a> page or <a href="http://www.ctdatahaven.org">main website</a>.</p>
		</Alert>
	</div>
);

export default Intro;
