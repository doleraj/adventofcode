package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import y2017.day15
import y2017.day15Second

class day15Test {
    @Test
    fun test1() {
        assertEquals(588, day15(65, 8921))
    }

    @Test
    fun testActual() {
        assertEquals(569, day15(116, 299))
    }

    @Test
    fun test1Second() {
        assertEquals(309, day15Second(65, 8921))
    }

    @Test
    fun testActualSecond() {
        assertEquals(298, day15Second(116, 299))
    }
}